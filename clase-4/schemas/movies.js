import z from 'zod'

// VALIDACIÓN DE DATOS
// Zod ignira lo que no necesita, por eje. se le podría pasar con seguridad:
/**
 {
  "sql": "SELECT * FROM users",
  "title": "Matrix Revolutions",
  "year": 2004,
  "director": "Wachowski Bros.",
  "duration": 112,
  "poster": "https://www.fakeurl.com/matrix_revolutions.jpg",
  "genre": [
    "Action",
    "Sci-fi"
  ],
  "rate": 6.9
}
 */

const movieShema = z.object({
  // no está la ID --> y no tiene que estar acá.
  // No tiene que validarse porque se crea en la ruta, y no puede modificarse por PATCH
  title: z.string({
    invalid_type_error: 'Movies must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5).optional(), // .nullable()
  poster: z.string().url({ // .endsWith('.jpg')
    message: 'Poster must be a valid url'
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Crime',
      'Adventure',
      'Drama',
      'Comedy',
      'Fantasy',
      'Horror',
      'Thriller',
      'Sci-fi'
    ]),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
  // otra manera de escribirlo
  // genre: z.enum(['Action', 'Adventure', 'Drama', 'Comedy', 'Fantasy', 'Horror', 'Thriller', 'Sci-fi'].array({
  // required_error: 'Movie genre is required',
  // invalid_type_error: 'Movie genre must be an array og enum Genre'
  // })
  // )
})

export function validateMovie (object) {
  // movieShema.parse(object) habría que manejar los errores
  // movieShema.safeParseAsync(object) para evitar el bloqueo
  return movieShema.safeParse(object)
}

export function validatePartialMovie (object) {
  // el partial() hace opcionales toas las propiedades, y si está presente, la valida
  return movieShema.partial().safeParse(object)
}
