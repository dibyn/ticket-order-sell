import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@suffix-ticketing/commonfn";
import { Message } from "node-nats-streaming";
import { Order } from "../../Models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = this.queueGroupName;
  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error("Order Not Found");
    order.set({
      status: OrderStatus.Complete,
    });
    msg.ack()
  }
}
