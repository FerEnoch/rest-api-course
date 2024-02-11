const http = require('node:http')
const fs = require('node:fs')
const { findAvailablePort } = require('../clase-1/10.free-port')
/**
 *  opciones para ver cambios en tiempo real:
 *  - --watch flag (nativa de node - experimental)
 *  - nodemon (nunca instalar globalmente)
 */
const desirePort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  const { url } = req
  res.setHeader('content-type', 'text/html; charset=utf-8')

  if (url === '/') {
    res.statusCode = 200 // OK --> por default
    res.end('<h1> Hola mundo -> Bienvenido a mi página de inicio </h1>')
  } else if (url === '/viking.png') {
    fs.readFile('./clase-2/images/drinking_viking.png', (err, binaryData) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1> 500 - Internal server error :( </h1>')
      } else {
        res.statusCode = 200
        res.setHeader('content-type', 'image/png')
        res.end(binaryData)
      }
    })
  } else if (url === '/contacto') {
    res.end('<h1> Página de contacto </h1>')
  } else {
    res.statusCode = 404
    res.end('<h1> 404 </h1>')
  }
}

const server = http.createServer(processRequest)

findAvailablePort(desirePort).then(port => {
  server.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
})
