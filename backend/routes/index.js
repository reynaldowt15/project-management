const router = require('express').Router()
const UserController = require('../controllers/UserController')
const UsersRouter = require('./users')
const ProjectsRouter = require('./projects')
const TaskRouter = require('./tasks')
const isAuth = require('../middleware/isAuth')


router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(isAuth)

router.use(`/users`, UsersRouter)
router.use(`/projects`, ProjectsRouter)
router.use(`/`, TaskRouter)

module.exports = router