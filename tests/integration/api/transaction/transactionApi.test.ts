import 'reflect-metadata';
import supertest from 'supertest';
import app from '@api/app';
import {TYPES} from '@constants/types';
import container from '@dependencyInjectionContainer';
import Transaction from '@domain/transaction/Transaction';
import TotalBalance from '@domain/totalBalance/TotalBalance'
import Database from '@infrastructure/database/Database';
import UpdateTotalBalance from '@application/useCases/UpdateTotalBalance';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import TransactionFactory from '@factories/TransactionFactory';
import ShareFactory from '@factories/ShareFactory';
import MonthlyBalanceFactory from '@factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '@factories/TotalBalanceFactory';
import ShareRepository from '@infrastructure/repositories/ShareRepository';
import MonthlyBalanceRepository from '@infrastructure/repositories/MonthlyBalanceRepository';
import TotalBalanceRepository from '@infrastructure/repositories/TotalBalanceRepository';
import TransactionRepository from '@infrastructure/repositories/TransactionRepository';
import { dateToMonthYear } from '@helpers';
import { MONTHLY_BALANCE_TYPE } from '@domain/monthlyBalance/MonthlyBalanceEnums';
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '@domain/shared/constants';

describe('transactionAPI', () => {
  const server = app.listen();
  const request = supertest(server);
  let database: Database;
  let shareRepository: ShareRepository; 
  let monthlyBalanceRepository: MonthlyBalanceRepository; 
  let totalBalanceRepository: TotalBalanceRepository; 
  let transactionRepository: TransactionRepository;
  let updateTotalBalance: UpdateTotalBalance;

  beforeAll(async () => {
    database = container.get<Database>(TYPES.Database);
    shareRepository = container.get<ShareRepository>(TYPES.ShareRepository);
    monthlyBalanceRepository = container.get<MonthlyBalanceRepository>(TYPES.MonthlyBalanceRepository);
    totalBalanceRepository = container.get<TotalBalanceRepository>(TYPES.TotalBalanceRepository);
    transactionRepository = container.get<TransactionRepository>(TYPES.TransactionRepository);
    updateTotalBalance = container.get<UpdateTotalBalance>(TYPES.UpdateTotalBalance);
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
    it('should return status and reason OK', async () => {
      const payload = new TransactionFactory().getPayloadObject();

      const response = await request.post('/transaction').send(payload);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toBe(ReasonPhrases.OK);
    });

    it('should create transaction', async () => {
      const transaction = new TransactionFactory();
      const payload = transaction.getPayloadObject();
      const expectedTransaction = transaction.getObject();

      await request.post('/transaction').send(payload);

      const [result] = await transactionRepository.get(
        payload.institutionId,
      );

      expect(expectedTransaction).toEqual(new TransactionFactory({}, result).getObject());
    });

    it('should create monthly balance if not exists', async () => {
      const factory = new TransactionFactory();
      const transaction = factory.get();
      const payload = factory.getPayloadObject();
      const expectedMonthlyBalance = new MonthlyBalanceFactory().getObject();

      await request.post('/transaction').send(payload);

      const result = await monthlyBalanceRepository.get(
        transaction.getInstitutionId(),
        dateToMonthYear(transaction.getDate()),
      );

      expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
    });

    describe('when the category of the transaction is BUY', () => {
      it('should create share if it not exists', async () => {
        const payload = new TransactionFactory().getPayloadObject();
        const expectedShare = new ShareFactory().getObject();

        await request.post('/transaction').send(payload);

        const result = await shareRepository.get(
          payload.ticketSymbol,
          payload.institutionId,
        );

        expect(expectedShare).toEqual(new ShareFactory({}, result).getObject());
      });

      it('should update share if it already exists', async () => {
        const payload = new TransactionFactory().getPayloadObject();
        const share = new ShareFactory();
        await share.save();
        const expectedShare = new ShareFactory({
          quantity: 200,
          totalCost: 2000,
        }).getObject();

        await request.post('/transaction').send(payload);

        const result = await shareRepository.get(
          payload.ticketSymbol,
          payload.institutionId,
        );

        expect(expectedShare).toEqual(new ShareFactory({}, result).getObject());
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
          tradeEarnings: 200,
        });
        const expectedMonthlyBalance = new MonthlyBalanceFactory({
          tradeEarnings: 1200,
        }).getObject();
        await new ShareFactory().save();
        await monthlyBalance.save();

        await request.post('/transaction').send(payload);

        const result = await monthlyBalanceRepository.get(
          transaction.getInstitutionId(),
          dateToMonthYear(transaction.getDate()),
        );

        expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
      });
    });

    describe('when the category of the transaction is SELL', () => {
      describe('need to update share', () => {
        let buyTransaction: TransactionFactory;

        beforeEach(async () => {
          buyTransaction = new TransactionFactory({
            date: new Date(new Date().setDate(1)),
          });
          await buyTransaction.save();
          await new ShareFactory().save();
          await new MonthlyBalanceFactory().save();
        });

        it('should update share if have not liquidated position', async () => {
          const payload = new TransactionFactory({
            type: TRANSACTION_TYPE.SELL,
            quantity: 50,
            unityPrice: 10,
            totalCost: 500,
          }).getPayloadObject();
          const expectedShare = new ShareFactory({
            quantity: 50,
            totalCost: 500,
          }).getObject();

          await request.post('/transaction').send(payload);

          const result = await shareRepository.get(
            buyTransaction.get().getTicketSymbol(),
            buyTransaction.get().getInstitutionId(),
          );

          expect(expectedShare).toEqual(new ShareFactory({}, result).getObject());
        });

        it('should delete shares if have liquidated position', async () => {
          const payload = new TransactionFactory({
            type: TRANSACTION_TYPE.SELL,
          }).getPayloadObject();

          await request.post('/transaction').send(payload);

          const result = await shareRepository.get(
            buyTransaction.get().getTicketSymbol(),
            buyTransaction.get().getInstitutionId(),
          );

          expect(result).toBeNull();
        });
      });

      describe('when there are earnings on sale', () => {
        describe('when there are day trade on month', () => {
          it('should charge tax independent of the total sale amount', async () => {
            const buyTransaction = new TransactionFactory();
            const payload = new TransactionFactory({
              type: TRANSACTION_TYPE.SELL,
              quantity: 50,
              unityPrice: 20,
              totalCost: 1000,
            }).getPayloadObject();

            const expectedMonthlyBalance = new MonthlyBalanceFactory({
              tradeEarnings: 500,
              tax: 100,
              type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
            }).getObject();

            await buyTransaction.save();
            await new ShareFactory().save();
            await new MonthlyBalanceFactory().save();

            await request.post('/transaction').send(payload);

            const result = await monthlyBalanceRepository.get(
              buyTransaction.get().getInstitutionId(),
              dateToMonthYear(buyTransaction.get().getDate()),
            );

            expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
          });
        });

        describe('when monthly sales amount was less than 20k', () => {
          it('should not charge tax ', async () => {
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
              tradeEarnings: 500,
            }).getObject();

            await buyTransaction.save();
            await new ShareFactory().save();
            await new MonthlyBalanceFactory().save();

            await request.post('/transaction').send(payload);

            const result = await monthlyBalanceRepository.get(
              buyTransaction.get().getInstitutionId(),
              dateToMonthYear(buyTransaction.get().getDate()),
            );

            expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
          });
        });

        describe('when sold more than 20k in the month', () => {
          describe('when do not deduct tax from loss', () => {
            it('should charge tax', async () => {
              const buyTransaction = new TransactionFactory({
                date: new Date(new Date().setDate(1)),
              });
              const payload = new TransactionFactory({
                type: TRANSACTION_TYPE.SELL,
                quantity: 100,
                unityPrice: 300,
                totalCost: 30000,
                date: new Date(new Date().setDate(10)),
              }).getPayloadObject();

              await buyTransaction.save();
              await new ShareFactory().save();
              await new MonthlyBalanceFactory().save();

              const expectedMonthlyBalance = new MonthlyBalanceFactory({
                tradeEarnings: 29000,

                tax: 4350,
              }).getObject();

              await request.post('/transaction').send(payload);

              const result = await monthlyBalanceRepository.get(
                buyTransaction.get().getInstitutionId(),
                dateToMonthYear(buyTransaction.get().getDate()),
              );

              expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
            });
          });

          describe('when deduct tax from loss', () => {
            let buyTransaction: TransactionFactory;
            let payload: Record<string, any>;

            beforeEach(async () => {
              buyTransaction = new TransactionFactory();
              payload = new TransactionFactory({
                type: TRANSACTION_TYPE.SELL,
                quantity: 50,
                unityPrice: 20,
                totalCost: 1000,
              }).getPayloadObject();

              await buyTransaction.save();
              await new ShareFactory().save();
              await new MonthlyBalanceFactory().save();
            });

            describe('when there are losses remaining after tax deductions', () => {
              let totalBalance: TotalBalance;

              beforeEach(async () => {
                totalBalance = await totalBalanceRepository.get(
                  payload.institutionId,
                );
                totalBalance.setLoss(1000);
                await updateTotalBalance.execute(totalBalance);
              });

              it('should update monthly balance', async () => {
                const expectedMonthlyBalance = new MonthlyBalanceFactory({
                  tradeEarnings: 500,

                  tax: 0,
                  type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
                }).getObject();

                await request.post('/transaction').send(payload);

                const result = await monthlyBalanceRepository.get(
                  buyTransaction.get().getInstitutionId(),
                  dateToMonthYear(buyTransaction.get().getDate()),
                );
                expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
              });

              it('should update total balance', async () => {
                const expectedTotalBalance = new TotalBalanceFactory({
                  loss: 900,
                }).getObject();

                await request.post('/transaction').send(payload);

                const result = await totalBalanceRepository.get(
                  payload.institutionId,
                );
                expect(expectedTotalBalance).toEqual(new TotalBalanceFactory({}, result).getObject());
              });
            });

            describe('when there are no losses remaining after tax deduction', () => {
              let totalBalance: TotalBalance;

              beforeEach(async () => {
                totalBalance = await totalBalanceRepository.get(
                  payload.institutionId,
                );
                totalBalance.setLoss(10);
                await updateTotalBalance.execute(totalBalance);
              });

              it('should update monthly balance', async () => {
                const expectedMonthlyBalance = new MonthlyBalanceFactory({
                  tradeEarnings: 500,
                  tax: 90,
                  type: MONTHLY_BALANCE_TYPE.DAY_TRADE,
                }).getObject();

                await request.post('/transaction').send(payload);

                const result = await monthlyBalanceRepository.get(
                  buyTransaction.get().getInstitutionId(),
                  dateToMonthYear(buyTransaction.get().getDate()),
                );
                expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
              });

              it('should update total balance', async () => {
                const expectedTotalBalance = new TotalBalanceFactory({
                  loss: 0,
                }).getObject();

                await request.post('/transaction').send(payload);

                const result = await totalBalanceRepository.get(
                  payload.institutionId,
                );
                expect(expectedTotalBalance).toEqual(new TotalBalanceFactory({}, result).getObject());
              });
            });
          });
        });
      });

      describe('when there are loss on sale', () => {
        describe('when do not have tax on month to pay ', () => {
          let buyTransaction: TransactionFactory;
          let payload: Record<string, any>;

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
            await new MonthlyBalanceFactory({
              tradeEarnings: 100,
              tax: 0,
            }).save();
          });

          it('should update total balance loss', async () => {
            const expectedTotalBalance = new TotalBalanceFactory({
              loss: 9900,
            }).getObject();

            await request.post('/transaction').send(payload);

            const result = await totalBalanceRepository.get(
              payload.institutionId,
            );
            expect(expectedTotalBalance).toEqual(new TotalBalanceFactory({}, result).getObject());
          });

          it('should update monthly balance', async () => {
            const expectedMonthlyBalance = new MonthlyBalanceFactory({
              tradeEarnings: 0,
              tax: 0,
            }).getObject();

            await request.post('/transaction').send(payload);

            const result =
              await monthlyBalanceRepository.get(
                buyTransaction.get().getInstitutionId(),
                dateToMonthYear(buyTransaction.get().getDate()),
              );

            expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
          });
        });

        describe('when have tax on month to pay', () => {
          let buyTransaction: TransactionFactory;
          let payload: Record<string, any>;

          beforeEach(async () => {
            buyTransaction = new TransactionFactory({
              quantity: 10,
              unityPrice: 11,
              totalCost: 110,
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
            await new ShareFactory({ quantity: 10, totalCost: 110 }).save();
            await new MonthlyBalanceFactory({
              tradeEarnings: 1000,
              tax: 135,
            }).save();
          });

          it('should recalculate tax and update monthly balance', async () => {
            const expectedMonthlyBalance = new MonthlyBalanceFactory({
              tradeEarnings: 990,
              tax: 132,
            }).getObject();

            await request.post('/transaction').send(payload);

            const result =
              await monthlyBalanceRepository.get(
                buyTransaction.get().getInstitutionId(),
                dateToMonthYear(buyTransaction.get().getDate()),
              );

            expect(expectedMonthlyBalance).toEqual(new MonthlyBalanceFactory({}, result).getObject());
          });
        });
      });
    });
  });
});
