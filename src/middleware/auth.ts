import jwt from 'jsonwebtoken'
import { MiddyRequest } from '../types'
import { newError } from '../utils'

export const validateToken = {
    before: async (request: MiddyRequest) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '').replace('Bearer', '')
            const providedUserId = request.event.requestContext.http.method === 'GET' ? request.event.rawQueryString : request?.event.body.userId
            if (!token) newError(401, 'No token provided')
            const data = jwt.verify(token, 'a1b1c1') as jwt.JwtPayload
            if (!data.id || !data.userId) newError(401, 'Invalid token')
            if (providedUserId !== data.userId) newError(401, 'Provided userId does not match currently logged-in user')
            request.event.id = data.id
            request.event.userId = data.userId
        } catch (error) {
            newError(401, 'Invalid token')
        }
    }
}
