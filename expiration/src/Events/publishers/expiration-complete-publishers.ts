import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@suffix-ticketing/commonfn";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
