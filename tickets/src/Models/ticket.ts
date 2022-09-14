/*
We work with our MongoDB database using Mongoose in order to have Mongoose communicate
with MongoDB, we have to create a model, and that model represents the collection of records we have
inside of Mongo DB
*/

import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
//doc and ticket address interface is the set of propeties required
//to build a record after the record is accutally and saved and essentially turned into a document,
//that document might save some additional properties placed on Mongoose automatically

// an interface that describes the properties that were required to create a record
// properties that are required to build a new ticket
interface TicketAttrs {
  title: string
  price: number
  userId: string
}
//an interface that describes the properties that a Ticket Document
// document or instance of ticket represents one single record
interface TicketDoc extends mongoose.Document {
  // properties that a Ticket has -
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
}
// model essentially represents the entire collection of data
// properties tied to the Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

// an schema that represents all the properties we wanted
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String
    }
  },
  // toJSON manipulate the JSON representation of this data.
  // alter mongo to save _id as id instead
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)
//So this is going to be the one and only way that we create new records again, just to make sure that
//we can have TypeScript helping us figure out the different types of attributes we're supposed to be providing.
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}
// ticket model <TicketDoc, TicketModel> are generices
// model creation
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export {
  Ticket
}

