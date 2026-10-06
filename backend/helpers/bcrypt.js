const bcrpyt = require('bcryptjs');

function hashPassword(password) {
    const salt = bcrpyt.genSaltSync(10);
    return bcrpyt.hashSync(password, salt);
}

function comparePassword(password, hashedPassword) {
    return bcrpyt.compareSync(password, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};