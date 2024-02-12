import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { cosrMiddleware } from './middlewares/cors.js'

/**
 * LAS APIS TIENEN QUE PODER RECIBIR DE TODO SIN ROMPERSE
 * NO PUEDEN PETAR * TIENEN QUE SER ROBUSTAS
 * Pero sólo van a procesar lo que necesitan..o sea, rechazar los ataques
*/

const app = express()

app.disable('x-powered-by')
app.use(json())

// se le podría pasar accepted_origins por parámetros
// app.use(cosrMiddleware({acceptedOrigins: ['http://..', 'https://...']}))
app.use(cosrMiddleware())

// Todos los recursos que sean MOVIES, se identifican con /movies
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
