import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { BadRequestError, validationRequest } from '@suffix-ticketing/commonfn'

const router = express.Router()
router.post('/api/users/signup',
      [body('email').isEmail().withMessage('Email must be valid'),
      body('password').trim().isLength({ min: 8, max: 20 }).withMessage('Password must be between 8 and 20 characters')], validationRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new BadRequestError('Email already exists')
  const user = User.build({ email, password })
  await user.save()
  const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)
  req.session = { jwt: userJwt }
  res.status(201).send(user)
})
export { router as signupRouter }
