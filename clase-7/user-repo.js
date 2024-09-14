import DBLocal from 'db-local'
const { Schema } = new DBLocal({ path: './db' })
import bcrypt from 'bcrypt'
import { SALT_ROUND } from './config.js'
import { Validation } from './validator.js'


const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// lo ideal sería hacer una interfaz de typescript
export class UserRepository {
  // se podría hacer un constructor con injección de dependencia

  static async create({ username, password }) {
    // 1. VALIDACIONES
    // lo mejor sería usar zod... pero no hay tiempo
    Validation.username(username)
    Validation.password(password)


    // 2. ASEGURARSE QUE EL USERNAME NO EXISTA
    const user = User.findOne({ username })
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()

    // bcrypt.hashSync() bloquea el thread principal
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND)
    // 10 es la salt standard. Es el número de veces que va a codificar,
    // de vueltas que va a dar.



    // esto se guarda en local, por ende, es sync
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id

  }


  static async login({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('username does not exist')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password is invalid')

    const { password: _, ...publicUser } = user

    return publicUser

  }


}