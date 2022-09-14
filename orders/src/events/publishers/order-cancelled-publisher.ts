import {
  OrderCancelledEvents,
  Publisher,
  Subjects,
} from "@suffix-ticketing/commonfn";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvents> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
