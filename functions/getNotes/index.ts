const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { validateToken } = require('../../middleware/auth')
const { validateGetQuery } = require('../../middleware/index')
const { errorHandler } = require('../../middleware/errorHandler')
const { newError } = require('../../utils')

const middy = require('@middy/core')

async function getNotes(userid) {

    const { Items } = await db.query({
        TableName: "notes-db",
        KeyConditionExpression: "#userId = :pk AND begins_with(#itemId, :skprefix)",
        ExpressionAttributeNames: {
            "#userId": "userId",
            "#itemId": "itemId"
        },
        ExpressionAttributeValues: {
            ":pk": userid,
            ":skprefix": "note-"
        }
    }).promise()

    return sendResponse({ success: true, notes: [...Items] })
}

const handler = middy()
    
    .use(validateToken)
    .use(validateGetQuery)
    .use(errorHandler())
    .handler(async (event, context) => {
        console.log(event)
        if (!event.id) newError(401, 'Invalid token')
        return await getNotes(event.rawQueryString.toString())
    })

module.exports = { handler }