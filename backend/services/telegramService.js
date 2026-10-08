const { Api } = require("node-telegram-bot-api");

const telegram = new Api(process.env.TELEGRAM_BOT_TOKEN);

async function sendTaskReminderNotification(task, chatId) {
    const message = `
🔔 Task Reminder

Task: ${task.title}
Priority: ${task.priority}

${task.description || ""}
    `.trim();

    await telegram.sendMessage({
        chat_id: chatId,
        text: message
    });
}

module.exports = {
    sendTaskReminderNotification
};