import express from 'express'
import logger from 'morgan'
import path from 'node:path'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  // ojo que esto es costoso
  connectionStateRecovery: {} // INCOMPLETO EN EL STREAM
})

/* TURSO db logs:
Created database giving-blink at group default in 17.218s.
Start an interactive SQL shell with:
   turso db shell giving-blink
To see information about the database, including a connection URL, run:
   turso db show giving-blink
To get an authentication token for the database, run:
   turso db tokens create giving-blink
 */
const db = createClient({
  url: "libsql://giving-blink-ferenoch.turso.io",
  authToken: process.env.DB_TOKEN
})

// El autoincrement no es buena práctica en general, mejor es UUID
await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    username TEXT
  )
`)

/**
 * socket -> es una conxión cliente
 * io -> es el servidor (al cual se conectan TODOS los clientes)
 */

io.on('connection', async (socket) => {
  /*
    Cada conexión lo ve como un usuario diferente (cada pestaña del
    navegador)
    Hay que hacer autenticación para que vea si es el mismo usuario.
  */
  console.log('a user has connected')


  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })


  socket.on('chat message', async (msg) => {
    console.log('message -> ', msg)

    io.emit('chat message', msg) // broadcasting
    /*
      el Servidor emite a TODOS los usuarios
    */
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'

    try {

      result = await db.execute({
        sql: 'INSERT INTO messages (content, username) VALUES (:message, :username)',
        args: {
          message: msg,
          username
        }
      })


    } catch (e) {
      console.error(e)
      return
    }

    /* sería mejor hacer un objeto con los parámetros */
    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)

  })


  if (!socket.recovered) { // si no se pudo recuperar de la desconexión, haz esto...
    // -> esto es recuperación de mensajes con la db, pero
    // también se hace como está en línea 17 (para el caso de desconexión)

    try {
      const results = await db.execute({
        sql: `SELECT id, content, username FROM messages WHERE id > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0] // esta data se la pasa el cliente mediante el objeto auth
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString(), row.username)
      })

    } catch (e) {
      console.error(e)
      return
    }


  }

})

// morgan es un logger usado en modo desarrollo
// Puede ser un buena práctica armar un archivo de los logs, en lugar
// de sólo dejarlos en la consola (default behavior)
app.use(logger('dev'))

app.get('/', (req, res) => {
  const viewPath = path.join(process.cwd(), 'client', 'index.html')
  res.sendFile(viewPath)
})

server.listen(port, () => {
  console.log('Server running on port: ', port)
})
