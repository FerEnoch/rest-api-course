import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import express, { json } from 'express'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repo.js';
const app = express();

app.use(cookieParser()) // nos da la posibilidad de modificar y leet las cookies
app.use(json())
/*
  Para las views usamos un template engine o sistema de plantillas,
    llamado ejs (basado en javascript).
  También existen handlebars o mustage
*/
app.set('view engine', 'ejs') // sabe automáticamente que se usa la carpeta 'views'

/*
 SESION -> es poder identificar si el usuario tiene permiso para navegar. Es decir,
 identificarlo en diferentes navegaciones mediante un proceso de verificación.
   Diferentes maneras de hacer sesión de usuario:
     Cada vez que el usuario haga login, se crea la sesión y se guarda
     el una db (por ejemplo REDIS, o también se puede user express-session);
     una vez creada, se le devuelve la id al usuario...
     Crearíamos, por ejemplo, el Schema de la session:
       const session = Schema('session', {
         _id: {type: String, required: true},
         user: {type: String, required: true},
         expires: {type: Date, required: true}
       })
   Pero esto tiene problemas:
       - necesitamos un ESTADO para guardar la sesión, para verificar que el
         usuario tiene acceso, que está verificado, que existe la sesión y no
         se ha cerrado, que está activa.
       - problema de seguridad, porque se pueden robar la sesión

   AUTENTICACION SIN ESTADO
   Hacer un ESTADO complica mucho las cosas, y para eso simplificamos usando
   JWT, que es justamente eso, una forma de comunicación segura, de intercambio
   de información, entre dos partes,sin necesidad de guardar el estado
   (sirve para muchas cosas, y no solo sesiones). Permite verificar que la persona
   o el sistema que envía la info es quien dice ser. Es un standard abierto,
   son interoperables (plataformas y lenguajes), seguros, escalables, flexibles.
       - HEADER
       - PAYLOAD
       - SIGNATURE -> palabra secreta, que hay que ponerla en .env
       
 */
app.use((req, res, next) => {
  const token = req.cookies?.access_token // 'access_token' le pusimos al crearlo
  let data = null

  req.session = { user: null } // creamos la propiedd session y podremos acceder a ella en cualquier endpoint 

  try {
    data = jwt.verify(token, SECRET_JWT_KEY) // data tiene el id y username que enviamos en el token en /login
    req.session.user = data
  } catch { }


  next() //-> seguir a la siguiente route o middleware
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
})



app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({
      id: user._id,
      username: user.username,
    },
      SECRET_JWT_KEY,
      {
        expiresIn: '1h' // Normalmente, el token de autenticación es más corto, y luego se pueden crear otros tokens de refresh
      }
    )
    /*
        - NO guardar en el cliente en session-storage ni en local-storage
        - Debería estar en una cookie -> tinee un poquito más de seguridad (NO SON PERFECTAS,
          PERO SON MÁS SEGURAS QUE LOS STORAGES)
            - las cookies son menos vulnerables al XSS (por su seguridad http-only
              que prohibe su acceso a través de javascript -> document.cookie devuelve string vacío)
            - las cookies tienen un tiempo de expiración per-se, nativo (aunque 
              puedas simular algo parecido para los storage...)
            - también las cookies se pueden poner que se envíen sólo a través de https,
              reduciendo la posibilidad del ataque del man-in-the-middle
            - los storages pueden ser accedidos desde javascript, posibilitando a atacantes
              a que lean la info y hagan peticiones en nombre del cliente (XS-request-forgery)
            - puedes hacer que las cookies sólo funcionen en  tu dominio
            - son más fáciles de usar, porque no tiene la responsabilidad el cliente de guardar
              o leer la info. Lo haces desde el servidor, garantizando la interoperabilidad entre
              servicios, etc...
    */

    /*
      Se podría crear un refreshToken que quede sólo en el server y que sirva sólo a los
      fines de crear accessTokens. Normalmente expiran en un tiempo mucho más largo.
      QUEDA PARA LA PRÓXIMA CLASE 
         const refreshToken = jwt.sign({
           id: user._id,
           username: user.username,
         },
         SECRET_JWT_KEY,
         {
           expiresIn: '7d' // Token mucho más largo
         }
         )
    */



    res
      .cookie('access_token', token, {
        httpOnly: true, // la cookie sólo se puede acceder en el servidor
        secure: process.env.NODE_ENV === 'production', // sólo accesible vía https
        sameSite: 'strict', // Sólo se puede acceder desde el mismo dominio -> o sea, no puede viajar en cualquier petición http, sólo las que lleguen a este dominio
        maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1h - en este caso no tiene mucho sentido, porque el jwt también expira
      })
      .send({ user })
    // Nunca enviar el usuario completo al cliente, porque estaría enviando el password
    // Lo ideal es tener diff interfaces de typescript: una con la info privada, y la otra
    // con la info pública

  } catch (error) {

    // OJO! Normalmente NO ES BUENA IDEA mandar el error al front,
    // porque se están mandando demasiados datos al cliente.
    res.status(401).send(error.message)
  }

})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {

    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {

    // OJO! Normalmente NO ES BUENA IDEA mandar el error al front,
    // porque se están mandando demasiados datos al cliente.
    res.status(500).send(error.message)
  }

})

app.post('/logout', (req, res) => {
  // Lo único que tenemos que hacer para cerrar sesión es limpiar la cookie
  res
    .clearCookie('access_token')
    .json({ message: 'Logout successfuly' })
  // también se podría agregar una redirección
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return req.status(403).send('Access not authorized')
  console.log({ user })
  res.render('protected', user)
})


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
