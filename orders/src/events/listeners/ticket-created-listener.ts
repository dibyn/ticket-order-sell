import { Message } from "node-nats-streaming";
import {
  Subjects,
  TicketCreatedEvents,
} from "@suffix-ticketing/commonfn";
import Listener from '@suffix-ticketing/commonfn/build/events/base-listener'
import { Ticket } from "../../Models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvents> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: TicketCreatedEvents["data"], msg: Message) {
    const { title, price, id } = data
    const ticket = Ticket.build({
      title, price, id
    })
    await ticket.save()
    msg.ack()
  }
}
