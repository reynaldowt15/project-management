const { User } = require('../models');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const validator = require(`validator`)

class UserController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email, and password are required.' });
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Please provide a valid email address.' });
            }

            const existingUser = await User.findOne({ where: { email: email } });
            if (existingUser) {
                return res.status(400).json({ message: 'An account with this email already exists.' });
            }

            const hashedPassword = hashPassword(password);
            const user = await User.create({ name, email: email, password: hashedPassword });
            const userData = user.get({ plain: true });
            delete userData.password;
            delete userData.GoogleId;

            return res.status(201).json({ message: 'Registration successful.', user: userData });
        } catch (error) {
            return next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Please provide a valid email address.' });
            }

            const user = await User.findOne({ where: { email: email } });
            if (!user || !(comparePassword(password, user.password))) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            const token = generateToken({ id: user.id, email: user.email });
            const userData = user.get({ plain: true });
            delete userData.password;
            delete userData.GoogleId;

            return res.status(200).json({ message: 'Login successful.', token, user: userData });
        } catch (error) {
            return next(error);
        }
    }

    static async userInfo(req, res, next) {
        try {
            const loggedUser = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'TelegramChatId'] })
            if (!loggedUser) {
                return res.status(404).json({ message: `User not found.` })
            }

            return res.status(200).json(loggedUser)
        } catch (error) {
            return next(error)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const { OAuth2Client } = require('google-auth-library');
            const client = new OAuth2Client();
            const idToken = req.headers.token

            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const gPayload = ticket.getPayload();
            console.log(gPayload)

            const [user, created] = await User.findOrCreate({
                where: { email: gPayload.email },
                defaults: { name: gPayload.name, email: gPayload.email, password: `google_password` }
            })

            const token = generateToken({ id: user.id, email: user.email });
            const userData = user.get({ plain: true });
            delete userData.password;
            delete userData.GoogleId;

            return res.status(200).json({ message: 'Login successful.', token, user: userData });

        } catch (error) {
            return next(error)
        }
    }

    static async updateTelegramChatId(req, res, next) {
        try {
            const { TelegramChatId } = req.body;

            if (!TelegramChatId) {
                return res.status(400).json({
                    message: "Telegram Chat ID is required"
                });
            }

            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            user.TelegramChatId = TelegramChatId;
            await user.save();

            return res.status(200).json({
                message: "Telegram Chat ID updated successfully",
                TelegramChatId: user.TelegramChatId
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;