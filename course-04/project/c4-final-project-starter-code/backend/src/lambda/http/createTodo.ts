import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);

    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);

    try {
      const newTodoItem: TodoItem = await createTodo(userId, newTodo);
      logger.info('Successfully created Todo for user: ' + userId);

      return {
        statusCode: 201,
        body: JSON.stringify({ newTodoItem })
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
