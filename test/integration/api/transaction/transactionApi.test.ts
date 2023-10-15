import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import Database from '@infrastructure/database/Database';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import TransactionFactory from '@factories/TransactionFactory';
import ListTransactions from '@application/queries/ListTransactions';
import ErrorCode from '@domain/shared/error/ErrorCode';
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';

describe('transactionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let listTransactions: ListTransactions;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    listTransactions = container.get<ListTransactions>(TYPES.ListTransactions);
  });

  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
  });

  afterAll(async () => {
    await database.connection().migrate.rollback();
    await database.connection().destroy();

    server.close();
  });

  describe('POST /transaction', () => {
    describe('When called the endpoint with valid schema', () => {
      it('should create transaction', async () => {
        const transaction = new TransactionFactory();
        const payload = transaction.getPayloadObject();
        const expectedTransaction = transaction.getObject();

        const response = await request.post('/transaction').send([payload]);

        const paginatedResponse = await listTransactions.execute(
          payload.institutionId,
        );

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.text).toBe(ReasonPhrases.CREATED);
        expect(
          new TransactionFactory({}, paginatedResponse.results[0]).getObject(),
        ).toEqual(expectedTransaction);
      });
    });

    describe('When called the endpoint with invalid schema', () => {
      it('should throw bad request error when dont send item', async () => {
        const expectedError = {
          message: 'value must contain at least 1 items',
          customCode: ErrorCode.SCHEMA_VALIDATOR,
          status: StatusCodes.UNPROCESSABLE_ENTITY,
        };

        const response = await request.post('/transaction').send([]);

        expect(response.body).toEqual(expectedError);
      });

      it('should throw shema validation error when is empty payload', async () => {
        const expectedError = {
          message: 'value must be an array',
          customCode: ErrorCode.SCHEMA_VALIDATOR,
          status: StatusCodes.UNPROCESSABLE_ENTITY,
        };

        const response = await request.post('/transaction').send();

        expect(response.body).toEqual(expectedError);
      });

      it('should throw shema validation error when payload has item with missing param', async () => {
        const expectedError = {
          message:
            '[0].institutionId is required, [0].type is required, [0].date is required, [0].category is required, [0].ticketSymbol is required, [0].quantity is required, [0].unityPrice is required, [0].totalCost is required',
          customCode: ErrorCode.SCHEMA_VALIDATOR,
          status: StatusCodes.UNPROCESSABLE_ENTITY,
        };

        const response = await request.post('/transaction').send([{}]);

        expect(response.body).toEqual(expectedError);
      });

      it('should throw shema validation error when send wrong param', async () => {
        const expectedMessage = `[0].institutionId must be a valid GUID, [0].type must be one of [${Object.values(
          TRANSACTION_TYPE,
        ).join(
          ', ',
        )}], [0].date must be in ISO 8601 date format, [0].category must be one of [${Object.values(
          TRANSACTION_CATEGORY,
        ).join(', ')}], [0].quantity must be a number`;

        const response = await request.post('/transaction').send([
          {
            institutionId: 'INVALID_UUID',
            type: 'INVALID_TYPE',
            date: '2022/01/01',
            category: 'INVALID_CATEGORY',
            ticketSymbol: 'TSLA',
            quantity: 'INVALID_NUMBER',
            unityPrice: 0,
            totalCost: 0,
          },
        ]);

        expect(response.body.message).toEqual(expectedMessage);
      });
    });
  });
});
