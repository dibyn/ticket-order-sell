import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvents } from "@suffix-ticketing/commonfn";
import Listener from "@suffix-ticketing/commonfn/build/events/base-listener";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../Models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvents> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: TicketUpdatedEvents["data"], msg: Message) {
    // const ticket = await Ticket.findById(data!.id);
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) throw new Error("Ticket not found");
    const { title, price } = data;
    ticket.set({
      title,
      price,
    });
    await ticket.save();
    msg.ack()
  }
}
