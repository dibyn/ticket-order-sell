import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful sign up', async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})
it('sets a cookie after a succcessful sign up ', async () => {
  const response = await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
})
it('disallows duplicate emails', async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})
it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test',
      password: 'password',
    })
    .expect(400)
  await request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test.',
      password: 'password',
    })
    .expect(400)
})
it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: 'test@test',
      password: 'asdfasdf',
    })
    .expect(400)
})
it('returns a 400 with missing email and password', async () => {
  return request(app).post(`/api/users/signup`).send({}).expect(400)
})
