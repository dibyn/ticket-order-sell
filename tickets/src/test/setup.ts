// import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
// import { app } from '../app'
jest.mock('../nats-wrapper')
let mongo: any
declare global {
  var signin: () => string[]
}
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri, {})
})
beforeEach(async () => {
  jest.clearAllMocks()
  jest.setTimeout(10000)
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})
afterAll(async () => {
  jest.setTimeout(10000)
  mongo && (await mongo.stop())
  await mongoose.connection.close()
})
// separate to a file
// global.signin = async () => {
//   const email = 'test@test.com'
//   const password = 'password'
//   const response = await request(app)
//     .post('/api/users/signup')
//     .send({
//       email,
//       password,
//     })
//     .expect(201)
//     const cookie = response.get('Set-Cookie')
//     return cookie
// }
global.signin = () => {
  // build a jwt payload  { id, email }
  const payload = { id: new mongoose.Types.ObjectId().toHexString(), email: 'test+1@test.com', iat: 1660889488 }
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  //build session object { jwt: MY_JWT }
  const session = { jwt: token }
  //turn that session into JSON
  const sessionJSON = JSON.stringify(session)
  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // return a string thats the cookie with encoded data
  return [`session=${base64}`]
}
