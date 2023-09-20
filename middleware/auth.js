const jwt = require('jsonwebtoken')
const { newError } = require('../utils')

const validateToken = {
    before: async (request) => {
        const token = request.event.headers.authorization.replace('Bearer ', '').replace('Bearer', '')
    
        console.log('Token: ' + token)
        if (!token) newError(401, 'No token provided')
        const data = jwt.verify(token, 'a1b1c1')
        if (!data.id || !data.userId) newError(401, 'Invalid token')
        request.event.id = data.id
        request.event.userId = data.userId
    }
}

module.exports = { validateToken }
