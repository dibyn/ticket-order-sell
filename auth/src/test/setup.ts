import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

let mongo: any
declare global {
  var signin: () => Promise<string[]>
}
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri, {})
})
beforeEach(async () => {
  jest.setTimeout(10000)
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})
afterAll(async () => {
  mongo && (await mongo.stop())
  await mongoose.connection.close()
})
// separate to a file
global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201)
    const cookie = response.get('Set-Cookie')
    return cookie
}
