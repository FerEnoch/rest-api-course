const fs = require('node:fs')
/**
 *  Si no existieran las promesas nativas en este módulo se usa promisify
 *  const { promisify } = require('node:util')
 *  const readFilePromise = promisify(fs.readFile)
 *  Sólo usar en los módulos que no tienen promesas nativas
*/

fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
  if (err) console.error(err)
  console.log(text + ' - asíncrono')
})

// lectura secuencial, síncrona
// no puede hacer otra cosa mientras lee el archivo
console.log('leyendo el primer archivo')
const text1 = fs.readFileSync('./archivo.txt', 'utf-8')

console.log(text1)

console.log('leyendo el segundo archivo')
const text2 = fs.readFileSync('./archivo2.txt', 'utf-8')

console.log(text2)
