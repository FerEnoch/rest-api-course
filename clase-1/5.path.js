const path = require('node:path')

// crear las rutas a mano está prohibido (es por la separación)
// Barra separadora de carpetas según OS
console.log(path.sep)

// unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'test.txt')
console.log(filePath)

// nombre del fichero de una ruta concreta
const myPath = '/tmp/midu-secret-files/password.txt'
const base = path.basename(myPath)
console.log(base)

const filename = path.basename(myPath, '.txt')
console.log(filename)

const extention = path.basename('myImage.jpg')
console.log(extention)
