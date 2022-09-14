import {
  Listener,
  OrderCreatedEvents,
  OrderStatus,
  Subjects,
} from "@suffix-ticketing/commonfn";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvents> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log('waiting this many milliseconds to process a job', delay)
    await expirationQueue.add({
      orderId: data.id,
    },
    {
      delay
    }
    );
    msg.ack()
  }
}
