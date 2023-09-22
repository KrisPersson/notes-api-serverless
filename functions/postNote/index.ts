import { db } from '../../services/index'
import { sendResponse, sendError } from '../../responses/index'
import { postBodySchema } from '../../schemas/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'
import { v4 as uuidv4 } from 'uuid'

import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type postNoteRequestBody = {
    userId: string;
    noteId: string;
    title: string;
    text: string;
}

async function postNote(body: postNoteRequestBody) {
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

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(postBodySchema) }))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as postNoteRequestBody
        return await postNote(body)
    })

// module.exports = { handler }
