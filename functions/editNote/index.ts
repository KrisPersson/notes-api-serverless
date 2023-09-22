import { db } from '../../services/index'
import { sendResponse} from '../../responses/index'
import { editBodySchema } from '../../schemas/index'
import { validateToken } from '../../middleware/auth'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { errorHandler } from '../../middleware/errorHandler'
import { newError } from '../../utils'

import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type editNoteRequestBody = {
    userId: string;
    noteId: string;
    title: string;
    text: string;
}

async function editNote(body: editNoteRequestBody) {
    const { title, text, userId, noteId } = body

    const { Item } = await db.get({
        TableName: 'notes-db',
        Key: { userId: userId, itemId: noteId }
    }).promise()

    if (!Item) newError(404, 'Note could not be found')

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

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(editBodySchema) }))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as editNoteRequestBody
        return await editNote(body)
    })

