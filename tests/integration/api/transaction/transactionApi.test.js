import request from 'supertest';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
  database,
  transactionRepository,
  shareRepository,
  monthlyBalanceRepository,
  totalBalanceRepository,
  updateTotalBalance,
} from '../../../../src/DependencyInjectionContainer';
import app from '../../../../src/api/app';
import TransactionFactory from '../../../factories/TransactionFactory.js';
import ShareFactory from '../../../factories/ShareFactory.js';
import MonthlyBalanceFactory from '../../../factories/MonthlyBalanceFactory.js';
import TotalBalanceFactory from '../../../factories/TotalBalanceFactory.js';
import { dateToMonthYear } from '../../../../src/helpers/Helpers.js';
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '../../../../src/domain/transaction/TransactionEnums.js';
import { MONTHLY_BALANCE_TYPE } from '../../../../src/domain/monthlyBalance/MonthlyBalanceEnums.js';

describe('transactionAPI', () => {
  beforeEach(async () => {
    await database.connection().migrate.latest();
    await database.connection().seed.run();
  });

  afterEach(async () => {
    await database.connection().migrate.rollback();
  });

  afterAll(async () => {
    await database.connection().destroy();
  });

  describe('POST /transaction', () => {
    it('should return status and reason OK', async () => {
      const payload = new TransactionFactory().getPayloadObject();

      const response = await request(app).post('/transaction').send(payload);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toBe(ReasonPhrases.OK);
    });

    it('should create transaction', async () => {
      const transaction = new TransactionFactory();
      const payload = transaction.getPayloadObject();
      const expectedTransaction = transaction.getObject();

      await request(app).post('/transaction').send(payload);

      const [{ id, ...result }] = await transactionRepository.get(
        payload.institutionId,
      );

      expect(expectedTransaction).toEqual(result);
    });

    it('should create monthly balance if not exists', async () => {
      const factory = new TransactionFactory();
      const transaction = factory.get();
      const payload = factory.getPayloadObject();
      const expectedMonthlyBalance = new MonthlyBalanceFactory().getObject();

      await request(app).post('/transaction').send(payload);

      const { id, ...result } = await monthlyBalanceRepository.get(
        transaction.getInstitutionId(),
        dateToMonthYear(transaction.getDate()),
      );

      expect(expectedMonthlyBalance).toEqual(result);
    });

    describe('when the category of the transaction is BUY', () => {
      it('should create share if it not exists', async () => {
        const payload = new TransactionFactory().getPayloadObject();
        const expectedShare = new ShareFactory().getObject();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await shareRepository.get(
          payload.ticketSymbol,
          payload.institutionId,
        );

        expect(expectedShare).toEqual(result);
      });

      it('should update share if it already exists', async () => {
        const payload = new TransactionFactory().getPayloadObject();
        const share = new ShareFactory();
        await share.save();
        const expectedShare = new ShareFactory({
          quantity: 200,
          totalCost: 2000,
        }).getObject();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await shareRepository.get(
          payload.ticketSymbol,
          payload.institutionId,
        );

        expect(expectedShare).toEqual(result);
      });
    });

    describe('when the category of the transaction is DIVIDENDS', () => {
      it('should update monthly balance', async () => {
        const factory = new TransactionFactory({
          category: TRANSACTION_CATEGORY.DIVIDENDS,
        });
        const transaction = factory.get();
        const payload = factory.getPayloadObject();
        const monthlyBalance = new MonthlyBalanceFactory({
          grossWins: 200,
          netWins: 100,
        });
        const expectedMonthlyBalance = new MonthlyBalanceFactory({
          grossWins: 1200,
          netWins: 1100,
        }).getObject();
        await new ShareFactory().save();
        await monthlyBalance.save();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await monthlyBalanceRepository.get(
          transaction.getInstitutionId(),
          dateToMonthYear(transaction.getDate()),
        );

        expect(expectedMonthlyBalance).toEqual(result);
      });

      it('should update total balance', async () => {
        const factory = new TransactionFactory({
          category: TRANSACTION_CATEGORY.DIVIDENDS,
        });
        const transaction = factory.get();
        const payload = factory.getPayloadObject();
        const expectedTotalBalance = new TotalBalanceFactory({
          wins: 1000,
        }).getObject();
        await new MonthlyBalanceFactory().save();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await totalBalanceRepository.get(
          transaction.getInstitutionId(),
        );

        expect(expectedTotalBalance).toEqual(result);
      });
    });

    describe('when the category of the transaction is SELL', () => {
      it('should not charge taxes if the monthly sales amount was less than 20k', async () => {
        const buyTransaction = new TransactionFactory({
          date: new Date(new Date().setDate(1)),
        });
        const payload = new TransactionFactory({
          type: TRANSACTION_TYPE.SELL,
          quantity: 50,
          unityPrice: 20,
          totalCost: 1000,
          date: new Date(new Date().setDate(10)),
        }).getPayloadObject();

        const expectedMonthlyBalance = new MonthlyBalanceFactory({
          grossWins: 500,
          netWins: 500,
        }).getObject();

        await buyTransaction.save();
        await new ShareFactory().save();
        await new MonthlyBalanceFactory().save();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await monthlyBalanceRepository.get(
          buyTransaction.get().getInstitutionId(),
          dateToMonthYear(buyTransaction.get().getDate()),
        );

        expect(expectedMonthlyBalance).toEqual(result);
      });

      it('should delete the share if all shares have been sold', async () => {
        const buyTransaction = new TransactionFactory({
          date: new Date(new Date().setDate(1)),
        });
        const payload = new TransactionFactory({
          type: TRANSACTION_TYPE.SELL,
        }).getPayloadObject();

        await buyTransaction.save();
        await new ShareFactory().save();
        await new MonthlyBalanceFactory().save();

        await request(app).post('/transaction').send(payload);

        const result = await shareRepository.get(
          buyTransaction.get().getTicketSymbol(),
          buyTransaction.get().getInstitutionId(),
        );

        expect(result).toBeNull();
      });

      it('should charge taxes if there are day trade operations in the month', async () => {
        const buyTransaction = new TransactionFactory();
        const payload = new TransactionFactory({
          type: TRANSACTION_TYPE.SELL,
          quantity: 50,
          unityPrice: 20,
          totalCost: 1000,
        }).getPayloadObject();

        const expectedMonthlyBalance = new MonthlyBalanceFactory({
          grossWins: 500,
          netWins: 400,
          taxes: 100,
          type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
        }).getObject();

        await buyTransaction.save();
        await new ShareFactory().save();
        await new MonthlyBalanceFactory().save();

        await request(app).post('/transaction').send(payload);

        const { id, ...result } = await monthlyBalanceRepository.get(
          buyTransaction.get().getInstitutionId(),
          dateToMonthYear(buyTransaction.get().getDate()),
        );

        expect(expectedMonthlyBalance).toEqual(result);
      });

      describe('when deduct tax from loss', () => {
        let buyTransaction;
        let payload;
        let totalBalance;

        beforeEach(async () => {
          buyTransaction = new TransactionFactory();
          payload = new TransactionFactory({
            type: TRANSACTION_TYPE.SELL,
            quantity: 50,
            unityPrice: 20,
            totalCost: 1000,
          }).getPayloadObject();
          totalBalance = await totalBalanceRepository.get(
            payload.institutionId,
          );
          totalBalance.setLoss(1000);

          await updateTotalBalance.execute(totalBalance);
          await buyTransaction.save();
          await new ShareFactory().save();
          await new MonthlyBalanceFactory().save();
        });

        it('should update monthly balance', async () => {
          const expectedMonthlyBalance = new MonthlyBalanceFactory({
            grossWins: 500,
            netWins: 500,
            taxes: 0,
            type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
          }).getObject();

          await request(app).post('/transaction').send(payload);

          const { id, ...result } = await monthlyBalanceRepository.get(
            buyTransaction.get().getInstitutionId(),
            dateToMonthYear(buyTransaction.get().getDate()),
          );
          expect(expectedMonthlyBalance).toEqual(result);
        });

        it('should update total balance', async () => {
          const expectedTotalBalance = new TotalBalanceFactory({
            wins: 500,
            loss: 900,
          }).getObject();

          await request(app).post('/transaction').send(payload);

          const { id, ...result } = await totalBalanceRepository.get(
            payload.institutionId,
          );
          expect(expectedTotalBalance).toEqual(result);
        });
      });

      describe('when there are loss on sale', () => {
        let buyTransaction;
        let payload;

        beforeEach(async () => {
          buyTransaction = new TransactionFactory({
            quantity: 10,
            unityPrice: 100,
            totalCost: 10000,
            date: new Date(new Date().setDate(1)),
          });
          payload = new TransactionFactory({
            type: TRANSACTION_TYPE.SELL,
            quantity: 10,
            unityPrice: 10,
            totalCost: 100,
            date: new Date(new Date().setDate(10)),
          }).getPayloadObject();
          await buyTransaction.save();
          await new ShareFactory({ quantity: 10, totalCost: 10000 }).save();
          await new MonthlyBalanceFactory().save();
        });

        it('should update total balance loss', async () => {
          const expectedTotalBalance = new TotalBalanceFactory({
            wins: 0,
            loss: 9900,
          }).getObject();

          await request(app).post('/transaction').send(payload);

          const { id, ...totalBalance } = await totalBalanceRepository.get(
            payload.institutionId,
          );
          expect(expectedTotalBalance).toEqual(totalBalance);
        });

        it('should update monthly balance loss', async () => {
          const expectedMonthlyBalance = new MonthlyBalanceFactory({
            loss: 9900,
          }).getObject();

          await request(app).post('/transaction').send(payload);

          const { id, ...monthlyBalance } = await monthlyBalanceRepository.get(
            buyTransaction.get().getInstitutionId(),
            dateToMonthYear(buyTransaction.get().getDate()),
          );

          expect(expectedMonthlyBalance).toEqual(monthlyBalance);
        });
      });

      it('should update total balance wins if there are gains on the sale', () => {});
      it('should update monthly balance loss if there are loss on the sale', () => {});
      it('should update monthly balance gross wins if there are gains on the sale', () => {});
      it('should update monthly balance net wins if there are gains on the sale', () => {});
    });
  });
});
