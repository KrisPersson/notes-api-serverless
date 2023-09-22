import httpErrorHandler from "@middy/http-error-handler"

function jsonErrorHandler() {
  return {
    onError: async (request) => {
      const { error } = request
      request.response = {
        statusCode: error?.statusCode ?? 500,
        body: JSON.stringify({
          success: false,
          message: error?.message || "Internal Server Error"
        })
      }
    }
  }
}

export const errorHandler = () => [httpErrorHandler(), jsonErrorHandler()] 
