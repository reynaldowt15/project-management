const app = require('../app')
const port = process.env.PORT || 3000
const startTaskNotificationJob = require('../jobs/taskNotificationJob')

app.listen(port, () => {
    console.log(`Project Management Web listening on port ${port}`)
    startTaskNotificationJob()
})