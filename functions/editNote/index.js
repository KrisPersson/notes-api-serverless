const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { editBodySchema } = require('../../schemas/index')
const { validateToken } = require('../../middleware/auth')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const { errorHandler } = require('../../middleware/errorHandler')
const { newError } = require('../../utils')

const validator = require('@middy/validator')
const { transpileSchema } = require('@middy/validator/transpile')

async function editNote(body) {
    const { title, text, userId, noteId } = body
    const today = new Date()
    const { Attributes } = await db.update({
        TableName: 'notes-db',
        Key: { userId: userId, itemId: noteId },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set title = :title, #t = :text, modifiedAt = :modifiedAt',
        ExpressionAttributeNames: {
            '#t': 'text'
        },
        ExpressionAttributeValues: {
          ':title': title,
          ':text': text,
          ':modifiedAt': today.toLocaleString()
        }
      }).promise()

    return sendResponse({ success: true, updatedNote: {...Attributes} })
}

const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(editBodySchema) }))
    .use(errorHandler())
    .handler(async (event, context) => {
        try {
            console.log(event)
            if (!event.id) newError(401, 'Invalid token')
            return await editNote(event?.body)
        } catch (error) {
            return sendError(400, { success: false, message: error.message })
        }
    })

module.exports = { handler }
