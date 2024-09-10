import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { cosrMiddleware } from './middlewares/cors.js'

/**
 * Tenemos que inyectar la dependencia MovieModel desde lo más
 * fuera posible para poder testearlo
 */
export const createApp = ({ movieModel }) => {
  const app = express()

  app.disable('x-powered-by')
  app.use(json())

  app.use(cosrMiddleware())

  const moviesRouter = createMovieRouter({ movieModel })

  app.use('/movies', moviesRouter)

  const PORT = process.env.PORT ?? 1234
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
}
