import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { validateToken } from '../../middleware/auth'
import { validateGetQuery } from '../../middleware/index'
import { errorHandler } from '../../middleware/errorHandler'

import middy from '@middy/core'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ItemList } from 'aws-sdk/clients/dynamodb'

type ExtAPIGatewayProxyEvent = APIGatewayProxyEvent & {
    rawQueryString: string;
}

interface Note {
    userId: string;
    itemId: string;
    createdAt: string;
    title: string;
    text: string;
    modifiedAt: string | null
}

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

    const notes = query.Items as ItemList

    return sendResponse({ success: true, notes: [...notes] })
}

export const getNotesHandler = middy()
    
    .use(validateToken)
    .use(validateGetQuery)
    .use(errorHandler())
    .handler(async (event: ExtAPIGatewayProxyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        return await getNotes(event.rawQueryString.toString())
    })

// module.exports = { handler }
