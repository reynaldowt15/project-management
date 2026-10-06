const { verifyToken } = require("../helpers/jwt")

function isAuth(req, res, next) {
    try {
        const auth = req.headers.authorization

        if (!auth) {
            return res.status(401).json({ message: `Authentication required.` })
        }

        const [type, token] = auth.split(` `)

        if (type !== `Bearer` || !token) {
            return res.status(401).json({ message: `Invalid authentication.` })
        }
        const payload = verifyToken(token)
        req.user = payload
        next()
    } catch (error) {
        res.status(401).json({ message: `Invalid or expired token` })
    }
}

module.exports = isAuth