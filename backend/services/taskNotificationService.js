const { Op } = require("sequelize");
const { User, Project, Task } = require("../models");
const { sendTaskReminderNotification } = require("./telegramService");

async function checkUpcomingTasks() {
    try {
        const now = new Date();

        const oneDayFromNow = new Date(
            now.getTime() + 24 * 60 * 60 * 1000
        );

        const oneDayPlusOneHour = new Date(
            now.getTime() + 25 * 60 * 60 * 1000
        );

        const tasks = await Task.findAll({
            where: {
                dueDate: {
                    [Op.between]: [
                        oneDayFromNow,
                        oneDayPlusOneHour
                    ]
                },
                TelegramNotified: false
            },
            include: [
                {
                    model: Project,
                    include: [
                        {
                            model: User
                        }
                    ]
                }
            ]
        });

        for (const task of tasks) {
            const chatId = task.Project.User.TelegramChatId;

            if (!chatId) {
                continue;
            }

            await sendTaskReminderNotification(task, chatId);

            task.TelegramNotified = true;
            await task.save();
        }

        console.log(
            `Checked upcoming tasks: ${tasks.length}`
        );
    } catch (error) {
        console.error(
            "Failed to check upcoming tasks:",
            error
        );
    }
}

module.exports = {
    checkUpcomingTasks
};