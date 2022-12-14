import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
// import cookieParser from 'cookie-parser'
import { currentuserRouter } from './routes/currentuser'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@suffix-ticketing/commonfn'

const app = express()
app.set('trust-proxy', true)
app.use(json())
// app.use(cookieParser())
app.use(cookieSession({ signed: false, secure: false /* process.env.NODE_ENV !== 'test' */ }))

app.use(currentuserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)
app.all('*', async () => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
