import {
  Listener,
  OrderCancelledEvents,
  Subjects,
} from "@suffix-ticketing/commonfn";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../Models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvents> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  async onMessage(data: OrderCancelledEvents["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error("Ticket not found");
    ticket.set({
      orderId: undefined,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      title: ticket.title,
      version: ticket.version,
      price: ticket.price,
    });
    msg.ack();
  }
}
