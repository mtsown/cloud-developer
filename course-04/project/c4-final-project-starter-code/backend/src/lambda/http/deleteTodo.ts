import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    // TODO: Remove a TODO item by id
    const userId = getUserId(event);

    try {
      await deleteTodo(userId, todoId);
      logger.info('Successfully deleted Todo for user: ' + userId);

      return {
        statusCode: 204,
        body: undefined
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);

      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
