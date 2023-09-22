import { newError } from '../utils'

export const validateGetQuery = {
    before: async (request) => {
        const queryString = request?.event.rawQueryString
        if (request.event.routeKey === 'GET /api/notes' && !queryString) newError(401, 'No query string provided')
    }
}

// module.exports = { validateGetQuery }
