import { readFile } from 'node:fs/promises'
// no todos los módulos tienen promesas - verlo en la documentación

console.log('Leyendo el primer archivo...')

readFile('./archivo.txt', 'utf-8')
  .then(text => {
    console.log(text + ' - asíncrono')
  })

console.log('--> hacer cosas mientras lee el archivo')
