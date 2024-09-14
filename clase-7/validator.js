// Recordar que lo mejor para esto es usar Zod
export class Validation {
  static username(username) {
    if (typeof username !== 'string') throw new Error('username must be a tring')
    if (username.length < 3) throw new Error('username must be at least 3 chars long')
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('password must be a tring')
    if (password.length < 3) throw new Error('password must be at least 3 chars long')
  }
}