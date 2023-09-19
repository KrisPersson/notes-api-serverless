const { db } = require('../../services/index')
const { sendResponse, sendError } = require('../../responses/index')
const { postBodySchema } = require('../../schemas/index')
const { validateToken } = require('../../middleware/auth')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const { errorHandler } = require('../../middleware/errorHandler')

const validator = require('@middy/validator')
const { transpileSchema } = require('@middy/validator/transpile')

async function postNote(body) {
    console.log('Got to Lambda!')
}

const handler = middy()
    
    .use(httpJsonBodyParser())
    .use(validateToken)
    .use(validator({ eventSchema: transpileSchema(postBodySchema) }))
    .use(errorHandler())
    .handler(async (event, context) => {
        try {
            console.log(event)
            if (!event.id || event?.error && event?.error === '401') return sendError(401, { success: false, message: 'Invalid token' })
            return await postNote(event?.body)
        } catch (error) {
            return sendError(400, { success: false, message: error.message })
        }
    })


module.exports = { handler }
