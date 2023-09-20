const { db } = require('../../services/index')
const { sendResponse } = require('../../responses/index')
const { encryptPassword } = require('../../bcrypt/index')
const { v4: uuidv4 } = require('uuid');
const { newError } = require('../../utils')
const { signupBodySchema } = require('../../schemas/index')

const middy = require('@middy/core')
const { errorHandler } = require('../../middleware/errorHandler')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const validator = require('@middy/validator')
const { transpileSchema } = require('@middy/validator/transpile')

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
        return newError(409,'User with provided username already exists')
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

const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validator({ eventSchema: transpileSchema(signupBodySchema) }))
    .use(errorHandler())
    .handler(async (event, context) => {
        console.log(event)
        return await userSignup(event?.body)
    })

module.exports = { handler }
