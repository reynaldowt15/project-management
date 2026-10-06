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

            return res.status(200).json({ message: 'Login successful.', token, user: userData });
        } catch (error) {
            return next(error);
        }
    }

    static async userInfo(req, res, next) {
        try {
            const loggedUser = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email'] })
            if (!loggedUser) {
                return res.status(404).json({ message: `User not found` })
            }

            return res.status(200).json(loggedUser)
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = UserController;