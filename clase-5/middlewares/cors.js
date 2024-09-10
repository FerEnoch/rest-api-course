import cors from 'cors'

/*
* para el CORS --> métodos normales: GET/POST/HEAD
*              --> métodos complejos: PUT/PATCH/DELETE
* En los métodos complejos existe el CORS PRE-FLIGHT -> OPTIONS
*/

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://movies.com' // --> dominio de producción
]

// app.use(cors()) --> lo arregla todo con un * -> funciona, pero OJO con esto
export const cosrMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    // filtrar los accepted-origins

    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
