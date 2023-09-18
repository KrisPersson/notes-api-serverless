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
        console.log(event)
        console.log(context)
        try {
            return await getNotes(event.rawQueryString)
        } catch (error) {
            return sendError(400, { success: false, message: error.message })
        }
    })
    .use(validateToken)

module.exports = { handler }
