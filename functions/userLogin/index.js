const { db } = require('../../services/index')
const jwt = require('jsonwebtoken')
const { sendResponse, sendError } = require('../../responses/index')
const { comparePassword } = require('../../bcrypt/index')

async function userLogin(body) {
    const { username, password } = body

    const { Item } = await db.get({
        TableName: "notes-db",
        Key: {
            userId: username,
            itemId: 'user-info'
        }
    }).promise()

    const passwordDoesMatch = await comparePassword(password, Item?.password)
    if (!Item || !passwordDoesMatch) return sendError(401, { success: false, message: 'Wrong username and/or password' })

    const token = jwt.sign({ id: Item.id, userId: Item.userId }, 'a1b1c1', {
        expiresIn: 864000
    })

    return sendResponse({ success: true, message: 'User logged in!', token })
}

module.exports.handler = async (event, context) => {
    console.log(event)
    console.log(context)
    try {
        return await userLogin(JSON.parse(event.body))
    } catch (error) {
        return sendError(400, { success: false, message: error.message})
    }
};