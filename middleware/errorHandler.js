const httpErrorHandler = require("@middy/http-error-handler")

function jsonErrorHandler() {
  return {
    onError: async (handler) => {
      const { error } = handler
      handler.response = {
        statusCode: error?.statusCode ?? 500,
        body: JSON.stringify({
          success: false,
          message: error?.message || "Internal Server Error"
        })
      }
    }
  }
}

module.exports = { errorHandler: () => [httpErrorHandler(), jsonErrorHandler()] }
