import {
  Listener,
  OrderCancelledEvents,
  OrderStatus,
  Subjects,
} from "@suffix-ticketing/commonfn";
import { Message } from "node-nats-streaming";
import { Order } from "../../Models/order";
import { queueGroupName } from "../queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvents> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCancelledEvents["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error("Order not found");
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    msg.ack();
  }
}
