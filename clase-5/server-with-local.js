import { createApp } from './app.js'
import { MovieModel } from './model/local-fs/movie.js'

// esto se puede iniciar desde el package.json
createApp({ movieModel: MovieModel })
