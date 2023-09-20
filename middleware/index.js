const middy = require('@middy/core')
const { newError } = require('../utils')

const validateGetQuery = {
    before: async (request) => {
        const queryString = request?.event.rawQueryString
        if (request.event.routeKey === 'GET /api/notes' && !queryString) newError(request, 401, 'No query string provided')
    }
}

module.exports = { validateGetQuery }
