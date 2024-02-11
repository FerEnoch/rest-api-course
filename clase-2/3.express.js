const dittoJSON = require('./pokémon/ditto.json')
const express = require('express')
const app = express()

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by') // desactivarlo por seguridad

// para evitar todo ese rollo, express tiene su middleware
app.use(express.json())

// el middleware puede tener un primer parámetro con la ruta específica que se desea procesar
// app.use((req, res, next) => {
//   // trackear la request a la DDBB
//   // revisar si el usuario tiene cookies
//   // salvar CORS
//   // servir archivos extáticos
//   // etc, etc...

//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()
//   // solo llegan las POST con content-type application/json

//   /**
//    * El middleware express.json(), hace esto:
//    */

//   // let body = ''

//   // // // LOS EVENTOS FUNCIONAN IGUAL EN EXPRESS
//   // req.on('data', chunk => {
//   //   // cada chunk es binario, por eso hay que transformarlo string
//   //   body += chunk.toString()
//   // })

//   // req.on('end', () => {
//   //   const data = JSON.parse(body)
//   //   data.timestamp = Date.now()
//   //   // mutamos la request, que es el mismo objeto que llegará a la función app.get
//   //   req.body = data
//   //   next() // --> mandatory!
//   // })
// })

app.get('/pokemon/ditto', (req, res) => {
  // express detecta automáticamente el content-type y el charset utf-8, y lo setea en la res
  // res.status(200).send('<h1>Mi página</h1>')

  // express también detecta que es un json, setea el header y hace el strigify..
  // res.json({ messaje: '<h1>Mi página</h1>' })

  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  // req.body -> deberíamos validar (siempre) y guardar en base de datos
  res.status(201).json(req.body)
})

// usar .use es como poner un *, todas las que no entren arriba, entran acá, como un default
app.use((req, res) => {
  res.status(404).json('<h1>404</h1>')
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
