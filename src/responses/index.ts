import { ResponseBody } from "../types/index"


export function sendResponse(response: ResponseBody) {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    } 
}

export function sendError(statusCode: number, response: ResponseBody) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
    } 
}
