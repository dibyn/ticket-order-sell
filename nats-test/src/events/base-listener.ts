import { Stan, Message } from 'node-nats-streaming'
import { Subjects } from './subjects';

interface Event {
  subject: Subjects,
  data: any
}
 // generic type
abstract class Listener<T extends Event> { // create a listener for all the different application of our project
  abstract subject: T['subject']; //name of the channel this listener is going to listen to
  abstract queueGroupName: string; // name of the queue group this listener will join
  protected ackWait = 5 * 1000;  // number of seconds this listener has to ack a message
  abstract onMessage(data: T['data'], msg: Message): void;  // function to run when a message is received
  private client: Stan; // pre-initialized NATS client
  constructor(client: Stan) { this.client = client; }
  subscriptionOptions() { // default subscription options
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }
  listen() { // code to setup the subscription
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message recevied: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
  parseMessage(msg: Message) { //helper function to parse a message
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
export default Listener
