const { Project } = require('../models/index')

class ProjectController {
    static async getProjects(req, res, next) {
        try {
            const projects = await Project.findAll({ where: { UserId: req.user.id }, order: [['createdAt', 'DESC']] })
            return res.status(200).json(projects)
        } catch (error) {
            return next(error)
        }
    }

    static async postProject(req, res, next) {
        try {
            const { name, description } = req.body
            if (!name) {
                return res.status(400).json({ message: `Project name is required.` })
            }

            const newProject = await Project.create({ name, description, UserId: req.user.id })
            return res.status(201).json(newProject)
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = ProjectController