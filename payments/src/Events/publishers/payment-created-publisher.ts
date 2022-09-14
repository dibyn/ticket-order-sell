import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@suffix-ticketing/commonfn";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
