import { Subjects } from "./subjects";
export interface TicketCreatedEvents { // it is an interface that is going
  // to describe the very distinct coupling between this
  //particular subject and the event data that is received
  subject: Subjects.TicketCreated;
  data: {
    id: string,
    title: string,
    price: number
  }
}
