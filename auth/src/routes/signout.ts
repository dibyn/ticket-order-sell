import express from 'express'
const router = express.Router()
router.get('/api/users/signout', (req, res) => {
  req.session = null
  res.status(201).send({})
})
export {
  router as signoutRouter
}
