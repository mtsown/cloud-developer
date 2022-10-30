import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { TodoItem } from '../../models/TodoItem'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos');

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event);

    try {
      const todoList: TodoItem[] = await getTodosForUser(userId);
      logger.info('Successfully got Todos for user: ' + userId);

      return {
        statusCode: 200,
        body: JSON.stringify({ todoList })
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
handler.use(
  cors({
    credentials: true
  })
)
