const { db } = require('../../services/index')
const jwt = require('jsonwebtoken')

const { sendResponse } = require('../../responses/index')
const { comparePassword } = require('../../bcrypt/index')
const { loginBodySchema } = require('../../schemas/index')
const { newError } = require('../../utils')
const middy = require('@middy/core')
const { errorHandler } = require('../../middleware/errorHandler')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const validator = require('@middy/validator')
const { transpileSchema } = require('@middy/validator/transpile')

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
    if (!Item || !passwordDoesMatch) return newError(401, 'Wrong username/password combination')

    const token = jwt.sign({ id: Item.id, userId: Item.userId }, 'a1b1c1', {
        expiresIn: 864000
    })

    return sendResponse({ success: true, message: 'User logged in!', token })
}

const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validator({ eventSchema: transpileSchema(loginBodySchema) }))
    .use(errorHandler())
    .handler(async (event, context) => {
        console.log(event)
        return await userLogin(event?.body)
    })

module.exports = { handler }
