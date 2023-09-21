const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { deleteBodySchema } = require('../../schemas/index')
const { validateToken } = require('../../middleware/auth')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const { errorHandler } = require('../../middleware/errorHandler')
const { newError } = require('../../utils')

const validator = require('@middy/validator')
const { transpileSchema } = require('@middy/validator/transpile')

async function deleteNote(body) {
    const { userId, noteId } = body

    const { Item } = await db.get({
        TableName: 'notes-db',
        Key: { userId: userId, itemId: noteId }
    }).promise()

    if (!Item) newError(404, 'Note could not be found')

    const response = await db.delete({
        TableName: 'notes-db',
        Key: {
            userId,
            itemId: noteId
        }
    }).promise()
    console.log(response)
    return sendResponse({ success: true, message: 'Note successfully deleted!' })
}

const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(deleteBodySchema) }))
    .use(errorHandler())
    .handler(async (event, context) => {
        console.log(event)
        if (!event.id) newError(401, 'Invalid token')
        if (event?.body.noteId === 'user-info') newError(403, 'This endpoint is not allowed to delete user-info.')
        return await deleteNote(event?.body)
    })

module.exports = { handler }
