import { AWSError } from "aws-sdk/lib/error"

export function newError(statusCode: number, message: string) {
    const newError = new Error(message) as AWSError
    newError.statusCode = statusCode
    throw newError
}
