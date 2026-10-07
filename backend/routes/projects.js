const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')

router.get(`/`, ProjectController.getProjects)
router.post(`/`, ProjectController.postProject)
router.get(`/:id`, ProjectController.getProjectById)
router.patch(`/:id`, ProjectController.updateProject)
router.delete(`/:id`, ProjectController.deleteProjectById)

module.exports = router