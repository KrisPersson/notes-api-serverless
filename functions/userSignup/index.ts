import { db } from '../../services/index'
import { sendResponse } from '../../responses/index'
import { encryptPassword } from '../../bcrypt/index'
import { v4 as uuidv4 } from 'uuid'
import { newError } from '../../utils'
import { signupBodySchema } from '../../schemas/index'

import middy from '@middy/core'
import { errorHandler } from '../../middleware/errorHandler'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type userSignupRequestBody = {
    username: string;
    password: string;
    email: string;
}

async function userSignup(body: userSignupRequestBody): Promise<any> {
    const { username, password, email } = body

    const { Count } = await db.query({
        TableName: "notes-db",
        KeyConditionExpression: "#userId = :pk",
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":pk": username
        }
    }).promise()

    if (Count as number > 0) {
        return newError(409,'User with provided username already exists')
    }

    const hashedPassword = await encryptPassword(password)
    const today = new Date()

    await db.put({
        TableName: 'notes-db',
        Item: {
            userId: username,
            itemId: 'user-info',
            id: uuidv4(),
            password: hashedPassword,
            email,
            createdAt: today.toLocaleString()
        }
    }).promise()

    return sendResponse({ success: true, message: 'New user created' })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validator({ eventSchema: transpileSchema(signupBodySchema) }))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent ): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as userSignupRequestBody
        return await userSignup(body)
    })
