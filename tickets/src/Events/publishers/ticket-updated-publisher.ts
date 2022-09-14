import { Publisher, Subjects, TicketUpdatedEvents  } from "@suffix-ticketing/commonfn";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvents> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
