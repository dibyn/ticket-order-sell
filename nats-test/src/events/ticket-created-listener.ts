import { Message } from 'node-nats-streaming'
import Listener from './base-listener' // base class
import { TicketCreatedEvents } from './ticket-created-events'; // interface
import { Subjects } from './subjects'; // enum
// listener for ticket:created
export class TicketCreatedListener extends Listener<TicketCreatedEvents> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated; //name of the channel listener going to listen to
  queueGroupName: string = 'payments-service'; // name of the queue group this listener will join
  onMessage(data: TicketCreatedEvents['data'], msg: Message) { // function to run when message is received
    console.log('Event data', data)
    msg.ack();
  }
}
