const router = require('express').Router()
const UserController = require('../controllers/UserController')
const isAuth = require('../middleware/isAuth')

router.use(isAuth)

router.get(`/info`, UserController.userInfo)
router.patch(`/telegram`, UserController.updateTelegramChatId)

module.exports = router