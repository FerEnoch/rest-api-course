const crypto = require('node:crypto')
const express = require('express')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const { movies } = require('./movies.json')
const app = express()
/**
 * LAS APIS TIENEN QUE PODER RECIBIR DE TODO SIN ROMPERSE
 * NO PUEDEN PETAR * TIENEN QUE SER ROBUSTAS
 * Pero sólo van a procesar lo que necesitan..o sea, rechazar los ataques
*/

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://movies.com' // --> dominio de producción
]

app.disable('x-powered-by')
app.use(express.json())

// para el CORS --> métodos normales: GET/POST/HEAD
//              --> métodos complejos: PUT/PATCH/DELETE
// En los métodos complejos existe el CORS PRE-FLIGHT -> OPTIONS
app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin) // -> acá se puede poner el dominio específico que querramos
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  }
  res.sendStatus(200)
})

/**
 * 1 - npm install cors -E
 * 2 - const cors = require('cors')
 * 3 - app.use(cors()) --> lo arregla todo con un * -> funciona, pero OJO con esto
 * 4 - poner algunos reparos al * a todo:
    app.use(cors({
    origin: (origin, callback) {
      // filtrar los accepted-origins
        const ACCEPTED_ORIGINS = [
          'http://localhost:8080',
          'http://localhost:1234',
          'http://movies.com'
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
          return callback(null, true)
        }

        if (!origin) {
        return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS))
 }
 }))
 */

// Todos los recursos que sean MOVIES, se identifican con /movies
app.get('/movies', (req, res) => {
  const origin = req.header('origin')
  // --> pero el navegador no envía la cabecera origin cuando la petición es del mismo origen
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin) // -> acá se puede poner el dominio específico que querramos
  }

  const { genre: providedGenre } = req.query
  if (providedGenre) {
    const filteredMovies = movies.filter(({ genre: movieGenres }) => {
      return movieGenres.some(g => g.toLowerCase() === providedGenre.toLowerCase())
    })

    if (filteredMovies.length > 0) return res.json(filteredMovies)
    res.status(404).json({ message: 'No movies found with provided genre' })
  }

  res.json(movies)
})

app.get('/movies/:id', (req, res) => { // --> path-to-regex (incorporada a express)
  const { id } = req.params
  const movie = movies.find(({ id: movieId }) => movieId === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

// La ruta para el recurso debe ser la misma siempre -> NO usar un /movies/create...o algo así.
app.post('/movies', (req, res) => {
  /**
   * HAY QUE VALIDAR!... porque si no te inyectan cualquier cosa
   * NUNCA hacer:
   * const newMovie = {
   * id: 123456,
   * ...req.body
   * }
  *
  */

  // if (!title || !genre || !year) ... este tipo de validaciones es bastante costosa y larga
  // por eso utilizamos zod (entre las que hay 1000 opciones que existen)
  // RECORDAR: necesitamos validación en runtime (NO LO ARREGLA TYPESCRIPT)
  const result = validateMovie(req.body)
  // 400 --> bad request
  // 422 --> unprocessable entity
  if (result.error /* !result.success */) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // Universal Unique Identifier v4
    ...result.data
  }

  // esto no sería REST porque estamos guardando el estado de la app en memoria,
  // mutando el json original...
  movies.push(newMovie)

  // muchas veces se devuelve el recurso para actualizar la cache del cliente con la id creada
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(({ id: movieId }) => movieId === id)
  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  /**
  NO HACER ESTO
  const { title, duration } = req.body
  if (title) movie.title = title
  if (duration) movie.duration = duration
  ...
  ...
  */

  const result = validatePartialMovie(req.body)
  if (result.error /* !result.success */) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const updatedMovie = {
    ...movies[movieIndex], // si se le pasó un objeto vacío, no lo rompe
    ...result.data
  }

  // Recordar: esto no es REST -> se guarda en ddbb
  movies[movieIndex] = updatedMovie

  res.status(200).json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  // --> pero el navegador no envía la cabecera origin cuando la petición es del mismo origen
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin) // -> acá se puede poner el dominio específico que querramos
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(({ id: movieId }) => movieId === id)

  if (movieIndex === -1) return req.status(404).json({ message: 'Movie not found' })

  movies.splice(movieIndex, 1)

  return res.status(200).json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
