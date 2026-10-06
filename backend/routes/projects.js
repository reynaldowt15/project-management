const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')
const isAuth = require('../middleware/isAuth')

router.use(isAuth)

router.get(`/`, ProjectController.getProjects)
router.post(`/`, ProjectController.postProject)

module.exports = router