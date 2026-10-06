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

    static async getProjectById(req, res, next) {
        try {
            const { id } = req.params

            const project = await Project.findOne({ where: { id } })
            if (!project) {
                return res.status(404).json({ message: `Project not found.` })
            }

            if (project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })

            }

            return res.status(200).json(project)
        } catch (error) {
            return next(error)
        }
    }

    static async updateProject(req, res, next) {
        try {
            const { id } = req.params
            const { name, description } = req.body

            const project = await Project.findOne({ where: { id } })
            if (!project) {
                return res.status(404).json({ message: `Project not found.` })
            }

            if (project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })

            }

            if (name !== undefined) {
                if (!name) {
                    return res.status(400).json({ message: `Project name is required.` })
                }
                project.name = name
            }

            if (description !== undefined) {
                project.description = description
            }

            await project.save()

            res.status(200).json(project)
        } catch (error) {
            return next(error)
        }
    }

    static async deleteProjectById(req, res, next) {
        try {
            const { id } = req.params

            const project = await Project.findOne({ where: { id } })
            if (!project) {
                return res.status(404).json({ message: `Project not found.` })
            }

            if (project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })

            }

            await project.destroy()
            return res.status(200).json({ message: `Project ${project.name} deleted successfully.` })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = ProjectController