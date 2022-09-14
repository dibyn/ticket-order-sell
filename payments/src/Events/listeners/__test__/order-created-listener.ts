import {
  Listener,
  OrderCreatedEvents,
  OrderStatus,
  Subjects,
} from "@suffix-ticketing/commonfn";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "../../queue-group-name";
import { Order } from "../../../Models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvents> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvents["data"],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
