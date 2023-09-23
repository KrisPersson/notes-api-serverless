import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
import { validateGetQuery } from '../../middleware/index'
import { errorHandler } from '../../middleware/errorHandler'
import middy from '@middy/core'

import { APIGatewayProxyResult } from "aws-lambda"
import { MiddyEvent, Note } from "../../types/index"

async function getNotes(userid: string) {

    const query = await db.query({
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

    const notes = query.Items as Note[]

    return sendResponse({ success: true, notes: [...notes] })
}

export const getNotesHandler = middy()
    
    .use(validateToken)
    .use(validateGetQuery)
    .use(errorHandler())
    .handler(async (event: MiddyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const string = event.rawQueryString?.toString() as string
        return await getNotes(string)
    })
