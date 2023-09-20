const postBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['title', 'text'],
        properties: {
            userId: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            id: {
                type: 'string',
                minLength: 20,
                maxLength: 40
            },
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 50
            },
            text: {
                type: 'string',
                minLength: 0,
                maxLength: 300
            }
        }

      }
    }
}

const editBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['title', 'text', 'userId', 'noteId'],
        properties: {
            userId: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            noteId: {
                type: 'string',
                minLength: 10,
                maxLength: 20
            },
            title: {
                type: 'string',
                minLength: 1,
                maxLength: 50
            },
            text: {
                type: 'string',
                minLength: 0,
                maxLength: 300
            }
        }
      }
    }
}

const deleteBodySchema = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        required: ['userId', 'noteId'],
        properties: {
            userId: {
                type: 'string',
                minLength: 1,
                maxLength: 50
                },
            noteId: {
                type: 'string',
                minLength: 10,
                maxLength: 20
            }
        }
      }
    }
}

module.exports = { postBodySchema, editBodySchema, deleteBodySchema }
