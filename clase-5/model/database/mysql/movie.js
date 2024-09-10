/**
 * OTRO MODELO que sea una copia del modelo del local-fs,
 * PERO CON EL MISMO CONTRTO!,
 * pero se conecta a la base de datos, y se deja de conectar
 * con el archivo físico (.json).
 *
 * Entonces, luego, sólo cambiando una línea, nos conectamos a la
 * ddbb, o trabajamos en local.
 * La idea, después, es no cambiar el import
 *  -> from /local-fs/movie.js ===> to /database/movies.js
 * sino, injectarlo :boom
 */

import mysql from 'mysql2/promise.js'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'mySQLpass@dev',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

// se podría --> connection.query('SELECT ...', (err, results) => ...)
// PERO ES MEJOR TRABAJAR CON PROMESAS --> import sql2/promise.js

export class MovieModel {
  // get all movies
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genres ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?',
        [lowerCaseGenre]
        // cliente de SQL se encarga de evitar la SQL injection transformando todo cadena de texto
        // que no se puede evaluar
      )

      /**
       * Ojo con usar los template strings con ${} porque da logar a la
       * injección de SQL! --> para eso está el método del ? con el array
       */
      if (genres.length === 0) return []

      const [{ id }] = genres
      const [moviesByGenre] = await connection.query(`
          SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate
            FROM movie 
            INNER JOIN movie_genres
            ON id = movie_id
          WHERE genre_id = ?
      `, [id])

      if (moviesByGenre.length === 0) return []

      return moviesByGenre
    }

    // el resultado es una tupla de 2 posiciones
    // 1 -> el resultado de la query
    // 2 -> info de la tabla
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie;'
    )

    return movies
  }

  // get movie by Id
  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie
      WHERE id = UUID_TO_BIN(?);`
      , [id]
    )

    if (movies.length === 0) return null

    return movies
  }

  // create movie
  static async create ({ input }) {
    const {
      // genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // creamos el UUID con SQL (en vez de utilizar crypto.randomUUID())
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    // typeof uuid, uuid --> string f66f07ec-cc45-11ee-a1d8-d8bbc1432dc3

    // TO DO --> crear la conexión de genre
    /*

*/
    try {
      // insert movie --> con el uuid no hay peligro de SQL INJECTION
      await connection.query(
        `INSERT INTO movie (id, title, year, duration, director, rate, poster)
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, duration, director, rate, poster]
      )
      // OJO CON ESTO --> es necesario el ("${uuid}") en el VALUES
      // El array es automáticamente convertido a string...pero se ve que no funca el template string por si solo
      // y necesita de las comillas, si no, da error. Debe tener que ver con el momento en el cual
      // se hace la conversión.
    } catch (err) {
      // nunca permitir que el error lo vea el usuario
      // Porque puede enviar información sensible
      throw new Error('Error creating movie')
      // enviar la trazaa un servicio interno --> sendLog(err)
    }

    const [movies] = await connection.query(
          `SELECT BIN_TO_UUID(id) AS id, title, year, duration, director, rate, poster
           FROM movie
           WHERE id = UUID_TO_BIN(?)`,
          [uuid]
    )

    if (movies.length === 0) return null

    return movies
  }

  // delete movie
  static async delete ({ id }) {
    const [result] = await connection.query(
      'DELETE FROM movie WHERE BIN_TO_UUID(id) = ?', [id]
    )

    if (result.affectedRows === 0) return false
    return true
  }

  // update movie
  static async update ({ id, input }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate FROM movie
      WHERE id = UUID_TO_BIN(?);`
      , [id]
    )

    if (movies.length === 0) return null

    const { genre: genreInput } = input
    if (genreInput?.length > 0) {
      try {
        await Promise.all(genreInput.map(async genre => {
        // ver si el género existe
          const [genreResult] = await connection.query(
            'SELECT id FROM genre WHERE name LIKE ?', [`%${genre}%`]
          )

          // si el género no existe, hay que crearlo
          if (!genreResult.length) {
            await connection.query(
            `INSERT INTO genre (name)
            VALUES (?);`
            , [genre]
            )
          }

          // checkear si la conexión movie-género existe, si no, hay que armarla
          // esto no se hace si la película recién se crea...
          const [getConnectionQuery] = await connection.query(
          `SELECT BIN_TO_UUID(movie_id) AS id FROM movie_genres 
          WHERE genre_id = (
            SELECT id FROM genre WHERE name LIKE ?
          )`
          , [`%${genre}%`]
          )

          const isSomeMovieConected = getConnectionQuery.length > 0
          let isAlreadyConnected
          if (isSomeMovieConected) {
            const [{ id: movieWithGenreId }] = getConnectionQuery
            isAlreadyConnected = movieWithGenreId === id
          }
          // si existe el género, y no existe la conexión con la película
          //  hay que armar la conexión movie_id - genre_id
          if (!isAlreadyConnected) {
            await connection.query(
            `INSERT INTO movie_genres(movie_id, genre_id)
            VALUES
              (
              UUID_TO_BIN(?),
              (SELECT id FROM genre WHERE name = ?)
              );`
            , [id, genre]
            )
          }
        }))
      } catch (err) {
        console.error(err.message)
        // manejar mejor los errores --> El que más está saliendo es DUPLICATE_KEY (pero no rompe nada)
      }
    }

    const [movie] = movies
    const updatedMovie = {
      ...movie,
      ...input
    }
    const { title, year, director, duration, poster, rate } = updatedMovie

    const result = await connection.query(
    `UPDATE movie
       SET title = ?,
           year = ?,
           director = ?,
           duration = ?,
           poster = ?,
           rate = ?
       WHERE id = UUID_TO_BIN("${id}")
     `, [title, year, director, duration, poster, rate]
    )

    if (result.affectedRows === 0) return null
    return { title, year, director, duration, poster, rate }
  }
}
