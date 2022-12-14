import request from 'supertest'
import { app } from '../../app' // express app
import mongoose from 'mongoose'
// import { Ticket } from '../../Models/ticket' // Model

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
})
it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201)
  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`)
  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})
