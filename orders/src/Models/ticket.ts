import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAtrrs {
  title: string;
  price: number;
  id: string;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAtrrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
  }
);
schema.set('versionKey', 'version')
schema.plugin(updateIfCurrentPlugin)
// schema.pre('save', function(done) {
//   // @ts-ignore
//     this.$where = {
//       version: this.get('version') - 1
//     }
//     done()
// })
schema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  })
}
schema.statics.build = (attrs: TicketAtrrs) => new Ticket({
  _id: attrs.id,
  title: attrs.title,
  price: attrs.price
});
schema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      // $ = operator
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", schema);
export { Ticket };
