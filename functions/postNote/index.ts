const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { postBodySchema } = require('../../schemas/index')
const { validateToken } = require('../../middleware/auth')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const { errorHandler } = require('../../middleware/errorHandler')
const { newError } = require('../../utils')
const { v4: uuidv4 } = require('uuid');

const validator = require('@middy/validator')
const { transpileSchema } = require('@middy/validator/transpile')

async function postNote(body) {
    const { title, text, userId } = body
    const itemId = uuidv4()
    const today = new Date()
    const item = {
        userId,
        itemId: `note-${itemId.slice(0, 10)}`,
        title,
        text,
        createdAt: today.toLocaleString(),
        modifiedAt: null
    }

    await db.put({
        TableName: 'notes-db',
        Item: {...item}
    }).promise()

    return sendResponse({ success: true, newNote: {...item} })
}

const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(postBodySchema) }))
    .use(errorHandler())
    .handler(async (event, context) => {
        console.log(event)
        if (!event.id) newError(401, 'Invalid token')
        return await postNote(event?.body)
    })

module.exports = { handler }
