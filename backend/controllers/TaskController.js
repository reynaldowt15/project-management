const { Project, Task } = require('../models')

class TaskController {
    static async getTasks(req, res, next) {
        try {
            const { ProjectId } = req.params

            const project = await Project.findByPk(ProjectId)

            if (!project) {
                return res.status(404).json({ message: `Project not found.` })
            }
            if (project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })
            }

            const projectTasks = await Task.findAll({ where: { ProjectId }, order: [['createdAt', 'DESC']] })

            return res.status(200).json(projectTasks)
        } catch (error) {
            return next(error)
        }
    }

    static async addTask(req, res, next) {
        const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"];
        const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
        try {
            const { ProjectId } = req.params

            const project = await Project.findByPk(ProjectId)

            if (!project) {
                return res.status(404).json({ message: `Project not found.` })
            }
            if (project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })
            }

            const { title, description, status, priority, dueDate } = req.body

            if (!title) {
                return res.status(400).json({ message: `Title is required.` })
            }
            if (status && !allowedStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status.` })
            }
            if (priority && !allowedPriorities.includes(priority)) {
                return res.status(400).json({ message: `Invalid priority.` })
            }

            const newTask = await Task.create({
                title,
                description,
                status,
                priority,
                dueDate,
                ProjectId
            })

            return res.status(201).json(newTask)
        } catch (error) {
            return next(error)
        }
    }

    static async getTaskById(req, res, next) {
        try {
            const { id } = req.params

            const task = await Task.findOne({ where: { id }, include: { model: Project } })
            if (!task) {
                return res.status(404).json({ message: `Task not found.` })
            }
            if (task.Project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })
            }

            return res.status(200).json(task)
        } catch (error) {
            return next(error)
        }
    }

    static async updateTask(req, res, next) {
        try {
            const allowedStatuses = ["TODO", "IN_PROGRESS", "DONE"];
            const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

            const { id } = req.params

            const task = await Task.findOne({ where: { id }, include: { model: Project } })
            if (!task) {
                return res.status(404).json({ message: `Task not found.` })
            }
            if (task.Project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })
            }

            const { title, description, status, priority, dueDate } = req.body

            if (title !== undefined) {
                if (!title) {
                    return res.status(400).json({ message: `Title is required.` })
                }
                task.title = title
            }

            if (description !== undefined) {
                task.description = description
            }

            if (status !== undefined) {
                if (status && !allowedStatuses.includes(status)) {
                    return res.status(400).json({ message: `Invalid status.` })
                }
                task.status = status
            }

            if (priority !== undefined) {
                if (priority && !allowedPriorities.includes(priority)) {
                    return res.status(400).json({ message: `Invalid priority.` })
                }
                task.priority = priority
            }

            if (dueDate !== undefined) {
                task.dueDate = dueDate
                task.TelegramNotified = false
            }

            await task.save()

            res.status(200).json(task)
        } catch (error) {
            return next(error)
        }
    }

    static async deleteTaskById(req, res, next) {
        try {
            const { id } = req.params

            const task = await Task.findOne({ where: { id }, include: { model: Project } })
            if (!task) {
                return res.status(404).json({ message: `Task not found.` })
            }
            if (task.Project.UserId !== req.user.id) {
                return res.status(403).json({ message: `Forbidden access.` })
            }

            await task.destroy()

            res.status(200).json({ message: `Task ${task.title} deleted successfully.` })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = TaskController