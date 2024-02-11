const http = require('node:http')
// commonJS --> puede importarse un .json a saco
const dittoJSON = require('./pokémon/ditto.json')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('content-type', 'application/json; charset=utf-8')
          return res.end(dittoJSON) // acá midu dice que se devuelve JSON.stringify(dittoJSON)
        default:
          res.statusCode = 404
          res.setHeader('content-type', 'text-html; charset=utf-8')
          return res.end('<h1>404</h1>')
      }
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''
          // escuchar el evento data (es un stream)
          req.on('data', chunk => {
            // cada chunk es binario, por eso hay que transformarlo string
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            data.timestamp = Date.now()
            // La info está completa y se podría hacer cualquier acción
            // por eje, llamar a la base de datos para guardar la info
            res.writeHead(201, { 'Content-type': 'application/json; charset utf-8' })
            res.end(JSON.stringify(data))
          })
        }
          break
        default:
          res.statusCode = 404
          res.setHeader('content-type', 'text-html; charset=utf-8')
          return res.end('<h1>404</h1>')
      }
  }
}

const port = process.env.PORT ?? 3000
const server = http.createServer(processRequest)
server.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
