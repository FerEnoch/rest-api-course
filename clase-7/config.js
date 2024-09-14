export const {
  PORT = 3000,
  SALT_ROUND = 10, // se podría poner PROD=10 y TEST=1
  SECRET_JWT_KEY = 'acá-va-un-secret-key-que-tiene-que-ser-largo-y-hasheado-en-lo-posible' // lo ideal es NO poner un valor por defecto, sino usar .env
} = process.env