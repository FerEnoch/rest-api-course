const os = require('node:os') // forma recomendada de importar -> node:module

console.log('información del sist operativo')
console.log({
  'Nombre del sistema operativo': os.platform(),
  Versión: os.release(),
  Arquitectura: os.arch(),
  CPUs: os.cpus(), // -> vamos a poder escalar la app de node
  'Memoria libre en MB': os.freemem() / 1024 / 1024,
  'Memoria total': os.totalmem() / 1024 / 1024,
  uptime: os.uptime() // cuántos minutos lleva tu ordenador encendido
})
