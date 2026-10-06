const router = require('express').Router()
const UserController = require('../controllers/UserController')
const UsersRouter = require('./users')
const ProjectsRouter = require('./projects')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(`/users`, UsersRouter)
router.use(`/projects`, ProjectsRouter)

module.exports = router