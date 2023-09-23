import { Context, APIGatewayProxyEvent } from 'aws-lambda';


export interface Note {
    userId: string;
    itemId: string;
    createdAt: string;
    title: string;
    text: string;
    modifiedAt: string | null
}

export type MiddyEvent = APIGatewayProxyEvent & {
  id?: string;
  userId?: string;
  rawQueryString?: string;
  headers?: any;
  requestContext?: any;
  body?: any;
  error?: Error;
  routeKey?: string;
}

interface MiddyContext extends Context {
  
}

export type MiddyRequest = {
  event: MiddyEvent;
  context: MiddyContext;
  response?: any;
  error?: any;
}

export interface ResponseBody {
    success: boolean;
    notes?: Note[];
    message?: string;
    updatedNote?: Note;
    newNote?: Note;
    token?: string;
}

export type SendResponse = {
    statusCode: number;
    headers: {
        "Content-Type": "application/json"
    },
    body: ResponseBody;
}
