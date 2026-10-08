const router = require('express').Router()
const UserController = require('../controllers/UserController')
const UsersRouter = require('./users')
const ProjectsRouter = require('./projects')
const TaskRouter = require('./tasks')
const AiRouter = require('./ai')
const isAuth = require('../middleware/isAuth')


router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/google-login', UserController.googleLogin)

router.use(isAuth)

router.use(`/users`, UsersRouter)
router.use(`/projects`, ProjectsRouter)
router.use(`/`, TaskRouter)
router.use(`/`, AiRouter)

module.exports = router