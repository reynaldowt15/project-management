const router = require('express').Router()
const { generateTasks } = require("../controllers/AiController");

router.post("/projects/:id/generate-tasks", generateTasks);

module.exports = router;