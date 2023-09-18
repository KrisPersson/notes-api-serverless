const bcrypt = require('bcryptjs');
const saltRounds = 10

async function comparePassword(plainTextPassword, hashInDb) {
    const match = await bcrypt.compare(plainTextPassword, hashInDb)
    return match ? true : false
}

async function encryptPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, saltRounds)
}

module.exports = { comparePassword, encryptPassword }
