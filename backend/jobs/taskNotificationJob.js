const cron = require("node-cron");
const {
    checkUpcomingTasks
} = require("../services/taskNotificationService");

function startTaskNotificationJob() {
    cron.schedule("0 * * * *", async () => {
        console.log("Checking upcoming tasks...");

        await checkUpcomingTasks();
    });
}

module.exports = startTaskNotificationJob;