import { newError } from '../utils'
import { MiddyRequest } from "../types/index"

export const validateGetQuery = {
    before: async (request: MiddyRequest) => {
        const queryString = request.event.rawQueryString
        if (request.event.routeKey === 'GET /api/notes' && !queryString) newError(401, 'No query string provided')
    }
}

// module.exports = { validateGetQuery }
