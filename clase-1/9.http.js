const http = require('node:http')
const { findAvailablePort } = require('./10.free-port')

const desirePort = process.env.PORT ?? 3000

// Qué es lo que puede hacer un servidor?? -> recibir una request y dar una respuesta
const server = http.createServer((req, resp) => {
  console.log('request received')
  resp.end('Hola mundo')
})

// port = 0 --> va a buscar cualquier puerto libre
// NO ES RECOMENDABLE PARA PRODUCCIÓN USAR 0, porque necesitamos tener mayor control
// server.listen(0, () => {
//   console.log(`server listening on port ${server.address().port}`)
// })

findAvailablePort(desirePort).then(port => {
  server.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
})

// console.log(process.env) --> Recordat que node tiene acceso a TODO (sistema operativo, variables, etc...)
