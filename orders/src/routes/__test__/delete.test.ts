import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../Models/order";
import { Ticket } from "../../Models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
  //create a ticket with ticket Model
  const ticket = Ticket.build({
    title: "asdf",
    price: 200,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  //make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expection to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus["Cancelled"]);
});
it("emits an order Cancelled event", async () => {
  //create a ticket with ticket Model
  const ticket = Ticket.build({
    title: "asdf",
    price: 200,
    id: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  //make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalled()
});
