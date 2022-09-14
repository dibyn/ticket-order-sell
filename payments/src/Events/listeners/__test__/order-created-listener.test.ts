import { OrderCreatedEvents, OrderStatus } from "@suffix-ticketing/commonfn";
import mongoose from "mongoose";
import { Order } from "../../../Models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "./order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvents["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "asdf",
    userId: "asdf",
    status: OrderStatus.Created,
    ticket: {
      id: "asdf",
      price: 10,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return {
    data,
    listener,
    msg,
  };
};
it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg)
  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
});
it('acks the message', async ()  => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
