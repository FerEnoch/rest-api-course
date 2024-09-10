import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils.js'
const { movies } = readJSON('./movies.json') // ruta relativa a desde donde se importa la función

/**
 * Esta es la lógica del negocio. Es lo que está haciendo
 * especial tu aplicación.
 * Cada información se trata de manera
 * diferente, y eso es justamente lo que queremos separar de las rutas
 * y todo lo demás.
 *
 * No es forzoso que sea una clase.
 * El hecho de que sea una clase nos ayuda a que el contrato sea claro y
 * definido, y al usar typescript, nos ayudará a que nuestro modelo sea
 * intercambiable
 */

// VALIDACIÓN --> Es responsabilidad del modelo la coherencia e integridad
//                 de los datos
export class MovieModel {
  // siempre deben ser asíncronos --> es compatible con todas las soluciones
  // El contrato establece que devuelve una promesa, y eso no cambiará
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter(({ genre: movieGenres }) => {
        return movieGenres.some(g => g.toLowerCase() === genre.toLowerCase())
      })
    }
    return movies
  }

  static async getById ({ id }) {
    return movies.find(({ id: movieId }) => movieId === id)
  }

  static async create ({ input }) {
    // Los datos del input llegan validados
    // El modelo es el que sabe cómo manejar la DDBB
    const newMovie = {
      id: randomUUID(), // Universal Unique Identifier v4
      ...input
    }

    // esto no sería REST porque estamos guardando el estado de la app en memoria,
    // mutando el json original...
    movies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(({ id: movieId }) => movieId === id)

    if (movieIndex === -1) return false

    // DDDBB action
    movies.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(({ id: movieId }) => movieId === id)
    if (movieIndex === -1) return false

    const updatedMovie = {
      ...movies[movieIndex], // si se le pasó un objeto vacío, no lo rompe
      ...input
    }

    // Recordar: esto no es REST -> se guarda en ddbb
    movies[movieIndex] = updatedMovie

    return updatedMovie
  }
}
