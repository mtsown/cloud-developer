import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import * as AWS from 'aws-sdk';

const logger = createLogger('todos');

// TODO: Implement businessLogic
const todoAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Business logic - Getting Todos for user: ' + userId);

  return todoAccess.getTodos(userId);
}

export async function createTodo(userId: string, newTodoData: CreateTodoRequest): Promise<TodoItem> {
  logger.info('Business logic - Creating Todo for user: ' + userId);

  const todoId = uuid.v4();
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo: TodoItem = { todoId, userId, createdAt, done, ...newTodoData };
  return todoAccess.createTodo(newTodo);
}

export async function updateTodo(userId: string, todoId: string, updateData: UpdateTodoRequest): Promise<void> {
  logger.info('Business logic - Updating Todo for user: ' + userId);

  return todoAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
  logger.info('Business logic - Deleting Todo for user: ' + userId);

  return todoAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(userId: string, todoId: string): Promise<string> {
  logger.info('Business logic - Creating attachment presigned url for user: ' + userId);

  const bucketName = process.env.ATTACHMENT_S3_BUCKET;
  const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  });
  await attachmentUtils.saveImgUrl(userId, todoId, bucketName);
  return signedUrl;
}