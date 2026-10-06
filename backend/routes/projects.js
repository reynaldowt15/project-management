const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')
const isAuth = require('../middleware/isAuth')

router.use(isAuth)

router.get(`/`, ProjectController.getProjects)
router.post(`/`, ProjectController.postProject)
router.get(`/:id`, ProjectController.getProjectById)
router.patch(`/:id`, ProjectController.updateProject)
router.delete(`/:id`, ProjectController.deleteProjectById)

module.exports = router