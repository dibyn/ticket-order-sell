import mongoose from 'mongoose'
import { Password } from '../services/password'

//an interface to describes the props that are required to create a new user
interface UserPropsInterface {
  email: string
  password: string
}
//an interface that decribes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string
  password: string
  updatedAt: Date
}

//we create two separate interfaces is because
// Reason: the properties that are
//required to create an order might be different than the properties that acutally
//end up on an order

//an interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(properties: UserPropsInterface): UserDoc
}
// schema tell all the properties user gonna have
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret, options) {
        ret.id = ret._id
        delete ret.password;
        delete ret.__v;
        delete ret._id;
    },
  }
})
userSchema.pre('save', async function (done) {
  if(this.isModified('password')) { // will true true when password is just set
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})
userSchema.statics.build = (properties: UserPropsInterface) => new User(properties)
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
export { User }
