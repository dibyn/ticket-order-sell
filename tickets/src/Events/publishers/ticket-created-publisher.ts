import { Publisher, Subjects, TicketCreatedEvents  } from "@suffix-ticketing/commonfn";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvents> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}
