const fs = require('node:fs') // a partir de node 16, se recomienda el prefijo node:

// stats -> status - información del archivo
const stats = fs.statSync('./archivo.txt') // synchronous

console.log(
  stats,
  stats.isFile(),
  stats.isDirectory(),
  stats.isSymbolicLink(),
  stats.size // tamaño en bytes
)