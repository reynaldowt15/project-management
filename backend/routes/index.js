const router = require('express').Router()
const UserController = require('../controllers/UserController')
const UsersRouter = require('./user')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(`/users`, UsersRouter)

module.exports = router