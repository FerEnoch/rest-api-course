const net = require('node:net')
/**
 * El módulo net utiliza el protocolo TCP, es más liviano que el del protocolo http,
 * y nos va a permitir hacer peticiones más rápidas, sin enviar cabeceras http,
 * y nos permite preguntar si un servidor está abierto, por ejemplo.
 */

function findAvailablePort (desirePort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desirePort, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // si no queremos devolver un puerto aleatorio, poner desirePort + 1
        findAvailablePort(0).then(resolve)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  findAvailablePort
}
