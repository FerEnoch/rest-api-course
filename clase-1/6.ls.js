// Creando el comando ls
// const fs = require('node:fs')

// fs.readdir('.', (err, files) => {
//   if (err) return console.log('Error al leer el directorio', err)

//   files.forEach(file => {
//     console.log(file)
//   })

// })

/** with promises */
const fs = require('node:fs/promises')

fs.readdir('./mjs')
  .then(files => {
    files.forEach(file => {
      console.log(file)
    })
  })
  .catch(err => console.log('Error al leer el directorio', err))
