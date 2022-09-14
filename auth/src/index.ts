import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  if(!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if(!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to db')
  } catch (error) {
    console.log(error)
  }
  app.listen(3011, () => {
    console.log('3011')
  })
}
start()
