const middy = require('@middy/core')
const { newError } = require('../utils')

const validateGetQuery = {
    before: async (request) => {
        const queryString = request?.event.rawQueryString
        if (request.event.routeKey === 'GET /api/notes' && !queryString) newError(request, 401, 'No query string provided')
    }
}
function validatePutBody(body) {

}
function validateDeleteBody(body) {

}
function validateLoginBody(body) {

}
function validateSignupBody(body) {

}

module.exports = { validateGetQuery, validatePutBody, validateDeleteBody, validateLoginBody, validateSignupBody }