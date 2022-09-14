import {
  OrderCreatedEvents,
  Publisher,
  Subjects,
} from "@suffix-ticketing/commonfn";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvents> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
