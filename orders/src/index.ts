import mongoose from 'mongoose'
import { app } from './app'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('Starting orders service...')
  if(!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if(!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined')
  if(!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined')
  if(!process.env.NATS_URL) throw new Error('NATS_URL must be defined')
  if(!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined')
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close()) // close on interrupt
    process.on('SIGTERM', () => natsWrapper.client.close()) // close on terminate
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to db')
  } catch (error) {
    console.log(error)
  }
  app.listen(3011, () => {
    console.log('3011')
  })
}
start()
