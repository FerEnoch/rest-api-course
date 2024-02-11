const { readFile } = require('node:fs/promises')
// no todos los módulos tienen promesas - verlo en la documentación
const { readFileSync } = require('node:fs')

/**
   * async-await --> asíncrono secuencial
   */

// Función auto-invocada (IIFE)
// sirve para poder hacer un top-level-await, que no está
// soportado en commonJS (sí en ESModules)

// recordar el punto y coma!
; (async () => {
  console.log('leyendo el primer archivo...')
  const text = await readFile('./archivo.txt', 'utf-8')
  console.log('primer texto: ', text)
  console.log('--> hacer cosas mientras lee el archivo')
  console.log('leyendo el segundo archivo')
  const text2 = readFileSync('./archivo2.txt', 'utf-8')
  console.log(text2)
})()
