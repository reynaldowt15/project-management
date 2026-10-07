const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

router.get(`/projects/:ProjectId/tasks`, TaskController.getTasks)
router.post(`/projects/:ProjectId/tasks`, TaskController.addTask)

router.get(`/tasks/:id`, TaskController.getTaskById)
router.patch(`/tasks/:id`, TaskController.updateTask)
router.delete(`/tasks/:id`, TaskController.deleteTaskById)

module.exports = router