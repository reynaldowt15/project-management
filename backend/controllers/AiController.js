const { Project } = require("../models/index");
const { generateTasksFromProject } = require("../services/aiService");

async function generateTasks(req, res) {
    try {
        const { id } = req.params;

        const project = await Project.findOne({ where: { id } });
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.UserId !== req.user.id) {
            return res.status(403).json({ message: `Forbidden access.` })
        }

        const result = await generateTasksFromProject(project);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to generate tasks"
        });
    }
}

module.exports = {
    generateTasks
};