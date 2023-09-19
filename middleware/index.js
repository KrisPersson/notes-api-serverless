const { sendResponse } = require('../../responses/index')
const middy = require('@middy/core')

const validatePostBody = {
    before: async (request) => {
        try {
            const { userId, id, title, note } = request.event.body
            if (request.event.id !== id || request.event.userId !== userId) throw new Error('401')

        } catch (error) {
            request.event.error = error.message

            return request.response
        }
    },
    onError: async (request)=> {
        request.event.error = '450'

        return request.response
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

module.exports = { auth, validatePostBody, validatePutBody, validateDeleteBody, validateLoginBody, validateSignupBody }