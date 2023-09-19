const jwt = require('jsonwebtoken')

function auth() {

}

const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '')
            const queryString = request.event.rawQueryString
            if (!token) throw new Error()
            const data = jwt.verify(token, 'a1b1c1')
            console.log(data)
            request.event.id = data.id
            request.event.userId = data.userId

        } catch (error) {
            request.event.error = '401'

            return request.response
        }
    },
    onError: async (request)=> {
        request.event.error = '401'

        return request.response
    }
}

module.exports = { validateToken }
