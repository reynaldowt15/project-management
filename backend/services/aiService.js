const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateTasksFromProject(project) {
    const prompt = `
You are a project management assistant.

Based on the following project, generate useful tasks.

Project name:
${project.name}

Project description:
${project.description || "No description provided"}

Return exactly 5 task suggestions.

Each task must contain:
- title
- description
- priority

Priority must be one of:
LOW
MEDIUM
HIGH

Return ONLY valid JSON in this format:

{
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description",
      "priority": "MEDIUM"
    }
  ]
}
`;

    const response = await client.responses.create({
        model: "gpt-5-mini",
        input: prompt
    });

    return JSON.parse(response.output_text);
}

module.exports = {
    generateTasksFromProject
};