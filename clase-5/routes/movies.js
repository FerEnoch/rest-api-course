import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

// import { readJSON } from '../utils.js'
// const { movies } = readJSON('./movies.json')

// importar un JSON en ESModules
/**
 1 -
 import fs from 'node:fs'
 const { movies } = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
 2 - Forma recomendada y nativa (aunque intrincada)
  Es más rápido que tener que parsear un JSON y usar el fs (sobre ttodo si el json es grande)
 */

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()
  // el Router no tiene la información de la lógica del negocio (MODEL)
  // Tampoco sabe lo que hace el controlador
  // TODOS SON CAJAS NEGRAS

  const movieController = new MovieController({ movieModel })

  moviesRouter.get('/', movieController.getAll)
  moviesRouter.get('/:id', movieController.getById)
  moviesRouter.post('/', movieController.create)
  moviesRouter.delete('/:id', movieController.delete)
  moviesRouter.patch('/:id', movieController.update)

  return moviesRouter
}
