import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { deleteBodySchema } from '../../schemas/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'
import { newError } from '../../utils'

import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type deleteNoteRequestBody = {
    userId: string;
    noteId: string;
}

async function deleteNote(body: deleteNoteRequestBody) {
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

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(deleteBodySchema) }))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as deleteNoteRequestBody
        if (body.noteId === 'user-info') newError(403, 'This endpoint is not allowed to delete user-info.')
        return await deleteNote(body)
    })
