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

export const moviesRouter = Router()
// el Router no tiene la información de la lógica del negocio (MODEL)
// Tampoco sabe lo que hace el controlador
// TODOS SON CAJAS NEGRAS

moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.post('/', MovieController.create)
moviesRouter.delete('/:id', MovieController.delete)
moviesRouter.patch('/:id', MovieController.update)
