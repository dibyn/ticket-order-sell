import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt) // change callback fn to async

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex') // generate random string
    const buf = (await scryptAsync(password, salt, 64)) as Buffer // hash the salt
    return `${buf.toString('hex')}.${salt}` // hash + salt
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.')
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer
    return buf.toString('hex') === hashedPassword
  }
}
