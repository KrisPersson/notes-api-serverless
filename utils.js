function newError(statusCode, message) {
    const newError = new Error(message)
    newError.statusCode = statusCode
    throw newError
}

module.exports = { newError }
