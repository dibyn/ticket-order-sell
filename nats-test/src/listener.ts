// similar in nature to request handlers
import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});
stan.on("connect", () => {
  console.log("Listener connected to NATS");
  stan.on("close", () => {
    console.log("NATS connection close");
    process.exit(); // manually exist the program
  });
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName("accouting-srv");
  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "queue-group-name",
  //   options
  // );
  // subscription.on("message", (msg: Message) => {
  //   const data = msg.getData();
  //   if (typeof data === "string")
  //     console.log(`received event #${msg.getSequence()}, with data, ${data}`);
  //   console.log("Message received");
  //   msg.ack();
  // });
  new TicketCreatedListener(stan).listen()
});
// watcher for handling close terminal
//graceful shutdown
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

/*
So we just need to remember that for every subscription we create, we are probably always going to
use set, deliver all available that we can get all the events that have been emitted in the past.
We're going to use set durable name to make sure that we keep track of all the different events that
have gone to this subscription or the SKU group, even if it goes offline for a little bit.
And then finally, we're going to use this cue group to make sure that we do not accidentally dump the
durable name, even if all of our services restart for a very brief period of time, and to make sure
that all these emitted events only go off to one instance of our services, even if we are running multiple
instances.
*/

// abstract class Listener { // create a listener for all the different application of our project
//   abstract subject: string; //name of the channel this listener is going to listen to
//   abstract queueGroupName: string; // name of the queue group this listener will join
//   protected ackWait = 5 * 1000;  // number of seconds this listener has to ack a message
//   abstract onMessage(data: any, msg: Message): void;  // function to run when a message is received
//   private client: Stan; // pre-initialized NATS client
//   constructor(client: Stan) { this.client = client; }
//   subscriptionOptions() { // default subscription options
//     return this.client
//       .subscriptionOptions()
//       .setDeliverAllAvailable()
//       .setManualAckMode(true)
//       .setAckWait(this.ackWait)
//       .setDurableName(this.queueGroupName);
//   }
//   listen() { // code to setup the subscription
//     const subscription = this.client.subscribe(
//       this.subject,
//       this.queueGroupName,
//       this.subscriptionOptions()
//     );
//     subscription.on("message", (msg: Message) => {
//       console.log(`Message recevied: ${this.subject} / ${this.queueGroupName}`);
//       const parsedData = this.parseMessage(msg);
//       this.onMessage(parsedData, msg);
//     });
//   }
//   parseMessage(msg: Message) { //helper function to parse a message
//     const data = msg.getData();
//     return typeof data === "string"
//       ? JSON.parse(data)
//       : JSON.parse(data.toString("utf8"));
//   }
// }
// // listener for ticket:created
// class TicketCreatedListener extends Listener {
//   subject: string = 'ticket:created'; //name of the channel listener going to listen to
//   queueGroupName: string = 'payments-service'; // name of the queue group this listener will join
//   onMessage(data:any, msg: Message) { // function to run when message is received
//     console.log('Event data', data)
//     msg.ack();
//   }
// }
