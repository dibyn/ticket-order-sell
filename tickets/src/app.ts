import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexRouter } from './routes'
import { updateTicketRouter } from './routes/update'
import { currentUser, errorHandler, NotFoundError } from '@suffix-ticketing/commonfn'

const app = express()
app.set('trust-proxy', true)
app.use(json())
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }))
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexRouter)
app.use(updateTicketRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
