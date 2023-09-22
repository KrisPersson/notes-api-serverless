import { db } from '../../services/index'
import jwt from 'jsonwebtoken'

import { sendResponse } from '../../responses/index'
import { comparePassword } from '../../bcrypt/index'
import { loginBodySchema } from '../../schemas/index'
import { newError } from '../../utils'
import middy from '@middy/core'
import { errorHandler } from '../../middleware/errorHandler'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'
import { transpileSchema } from '@middy/validator/transpile'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

type userLoginRequestBody = {
    username: string;
    password: string;
}

async function userLogin(body: userLoginRequestBody): Promise<any> {
    const { username, password } = body

    const { Item } = await db.get({
        TableName: "notes-db",
        Key: {
            userId: username,
            itemId: 'user-info'
        }
    }).promise()

    const passwordDoesMatch = await comparePassword(password, Item?.password)
    if (!Item || !passwordDoesMatch) return newError(401, 'Wrong username/password combination')

    const token = jwt.sign({ id: Item.id, userId: Item.userId }, 'a1b1c1', {
        expiresIn: 864000
    })

    return sendResponse({ success: true, message: 'User logged in!', token })
}

export const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validator({ eventSchema: transpileSchema(loginBodySchema) }))
    .use(errorHandler())
    .handler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        console.log(event)
        const body = event.body as unknown as userLoginRequestBody

        return await userLogin(body)
    })

