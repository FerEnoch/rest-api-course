import { MovieModel } from '../model/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

// VALIDACIÓN --> Es responsabilidad del controlador comprobar el
//                formato y coherencia de que el input tenga los datos
//                necesarios y válidos antes de enviarlo al modelo.
//                No pueden pasar de aquí datos incorrectos o maliciosos
export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query

    const movies = await MovieModel.getAll({ genre })

    if (movies.length === 0) return res.status(404).json({ message: 'No movies found with provided genre' })

    // Decide qué es lo que renderiza -> por ejemplo, injectar los datos en un html

    res.json(movies)
  }

  static async getById (req, res) { // --> path-to-regex (incorporada a express)
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
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
    if (result.error /* !result.success */) {
    // 400 --> bad request
    // 422 --> unprocessable entity
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })
    // muchas veces se devuelve el recurso para actualizar la cache del cliente con la id creada
    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
  /**
    * SOLUCIONADO en middlewares con cors()
    *
    * const origin = req.header('origin')
    * --> pero el navegador no envía la cabecera origin cuando la petición es del mismo origen
    * if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    * res.header('Access-Control-Allow-Origin', origin) // -> acá se puede poner el dominio específico que querramos
    * }
    */
    const { id } = req.params
    const result = await MovieModel.delete({ id })

    if (!result) req.status(404).json({ message: 'Movie not found' })

    return res.status(200).json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
  /**
   NO HACER ESTO PARA VALIDAR
   const { title, duration } = req.body
   if (title) movie.title = title
   if (duration) movie.duration = duration
   ...
   */
    const result = validatePartialMovie(req.body)

    if (result.error /* !result.success */) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, input: result.data })

    if (!updatedMovie) res.status(404).json({ message: 'Movie not found' })

    res.status(200).json(updatedMovie)
  }
}
