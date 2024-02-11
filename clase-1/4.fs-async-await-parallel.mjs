import { readFile } from 'node:fs/promises';
// no todos los módulos tienen promesas - verlo en la documentación

// Esto va a ser más rápido porque está haciendo las dos operaciones a la vez
// estamos paralelizando la asincronía
Promise.all([
  readFile('./archivo.txt', 'utf-8'),
  readFile('./archivo2.txt', 'utf-8')
]).then(([text, secondText]) => {
  console.log('leyendo el primer archivo...')
  console.log('primer texto: ', text)
  console.log('leyendo el segundo archivo')
  console.log('segundo texto: ', secondText)
})
console.log('--> hacer cosas mientras leen los archivos')
