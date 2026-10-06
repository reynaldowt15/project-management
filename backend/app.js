require('dotenv').config()

const express = require('express');
const router = require('./routes/index')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/check-health', (req, res) => {
    res.send('Server running!')
})

app.use(`/`, router)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
})

app.listen(port, () => {
    console.log(`Kanban Web listening on port ${port}`)
})