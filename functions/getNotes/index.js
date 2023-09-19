const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { validateToken } = require('../../middleware/auth')
const middy = require('@middy/core')

async function getNotes(userid) {

    const response = await db.query({
        "TableName": "notes-db",
        "KeyConditionExpression": "#userId = :pk",
        "ExpressionAttributeNames": {
            "#userId": "userId"
        },
        "ExpressionAttributeValues": {
            ":pk": userid
        }
    }).promise()

    return sendResponse(response)
}

const handler = middy()
    .handler(async (event, context) => {
        try {
            console.log(event)
            if (!event.id || event?.error && event?.error === '401') return sendError(401, { success: false, message: 'Invalid token' })
            return await getNotes(event.rawQueryString.toString())
        } catch (error) {
            return sendError(400, { success: false, message: error.message })
        }
    })
    .use(validateToken)

module.exports = { handler }
