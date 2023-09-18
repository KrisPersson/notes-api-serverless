function sendResponse(response) {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    } 
}

function sendError(statusCode, response) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    } 
}



module.exports = { sendResponse, sendError }
