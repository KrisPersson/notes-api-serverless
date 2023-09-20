const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { encryptPassword } = require('../../bcrypt/index')
const { v4: uuidv4 } = require('uuid');

async function userSignup(body) {
    const { username, password, email } = body

    const { Count } = await db.query({
        TableName: "notes-db",
        KeyConditionExpression: "#userId = :pk",
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":pk": username
        }
    }).promise()

    if (Count > 0) {
        return sendError(409, { success: false, message: 'User with provided username already exists' })
    }

    const hashedPassword = await encryptPassword(password)

    await db.put({
        TableName: 'notes-db',
        Item: {
            userId: username,
            itemId: 'user-info',
            id: uuidv4(),
            password: hashedPassword,
            email
        }
    }).promise()

    return sendResponse({ success: true, message: 'New user created' })
}

module.exports.handler = async (event, context) => {
    console.log(event)
    console.log(context)
    try {
        return await userSignup(JSON.parse(event.body))
    } catch (error) {
        return sendError(400, { success: false, message: error.message})
    }
};
