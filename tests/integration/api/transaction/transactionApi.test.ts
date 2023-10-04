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
import TransactionFactory from '../../../factories/TransactionFactory';
import ShareFactory from '../../../factories/ShareFactory';
import MonthlyBalanceFactory from '../../../factories/MonthlyBalanceFactory';
import TotalBalanceFactory from '../../../factories/TotalBalanceFactory';
import { dateToMonthYear } from '../../../../src/helpers/Helpers';
import {
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from '../../../../src/domain/transaction/TransactionEnums';
import { MONTHLY_BALANCE_TYPE } from '../../../../src/domain/monthlyBalance/MonthlyBalanceEnums';

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
          tradeEarnings: 200,
        });
        const expectedMonthlyBalance = new MonthlyBalanceFactory({
          tradeEarnings: 1200,
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
    });

    describe('when the category of the transaction is SELL', () => {
      describe('need to update share', () => {
        let buyTransaction;

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

          await request(app).post('/transaction').send(payload);

          const { id, ...share } = await shareRepository.get(
            buyTransaction.get().getTicketSymbol(),
            buyTransaction.get().getInstitutionId(),
          );

          expect(share).toEqual(expectedShare);
        });

        it('should delete shares if have liquidated position', async () => {
          const payload = new TransactionFactory({
            type: TRANSACTION_TYPE.SELL,
          }).getPayloadObject();

          await request(app).post('/transaction').send(payload);

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

            await request(app).post('/transaction').send(payload);

            const { id, ...result } = await monthlyBalanceRepository.get(
              buyTransaction.get().getInstitutionId(),
              dateToMonthYear(buyTransaction.get().getDate()),
            );

            expect(expectedMonthlyBalance).toEqual(result);
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

            await request(app).post('/transaction').send(payload);

            const { id, ...result } = await monthlyBalanceRepository.get(
              buyTransaction.get().getInstitutionId(),
              dateToMonthYear(buyTransaction.get().getDate()),
            );

            expect(expectedMonthlyBalance).toEqual(result);
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

              await request(app).post('/transaction').send(payload);

              const { id, ...result } = await monthlyBalanceRepository.get(
                buyTransaction.get().getInstitutionId(),
                dateToMonthYear(buyTransaction.get().getDate()),
              );
              expect(expectedMonthlyBalance).toEqual(result);
            });
          });

          describe('when deduct tax from loss', () => {
            let buyTransaction;
            let payload;

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
              let totalBalance;

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

                await request(app).post('/transaction').send(payload);

                const { id, ...result } = await monthlyBalanceRepository.get(
                  buyTransaction.get().getInstitutionId(),
                  dateToMonthYear(buyTransaction.get().getDate()),
                );
                expect(expectedMonthlyBalance).toEqual(result);
              });

              it('should update total balance', async () => {
                const expectedTotalBalance = new TotalBalanceFactory({
                  loss: 900,
                }).getObject();

                await request(app).post('/transaction').send(payload);

                const { id, ...result } = await totalBalanceRepository.get(
                  payload.institutionId,
                );
                expect(expectedTotalBalance).toEqual(result);
              });
            });

            describe('when there are no losses remaining after tax deduction', () => {
              let totalBalance;

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

                await request(app).post('/transaction').send(payload);

                const { id, ...result } = await monthlyBalanceRepository.get(
                  buyTransaction.get().getInstitutionId(),
                  dateToMonthYear(buyTransaction.get().getDate()),
                );
                expect(expectedMonthlyBalance).toEqual(result);
              });

              it('should update total balance', async () => {
                const expectedTotalBalance = new TotalBalanceFactory({
                  losss: 0,
                }).getObject();

                await request(app).post('/transaction').send(payload);

                const { id, ...result } = await totalBalanceRepository.get(
                  payload.institutionId,
                );
                expect(expectedTotalBalance).toEqual(result);
              });
            });
          });
        });
      });

      describe('when there are loss on sale', () => {
        describe('when do not have tax on month to pay ', () => {
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
            await new MonthlyBalanceFactory({
              tradeEarnings: 100,
              tax: 0,
            }).save();
          });

          it('should update total balance loss', async () => {
            const expectedTotalBalance = new TotalBalanceFactory({
              loss: 9900,
            }).getObject();

            await request(app).post('/transaction').send(payload);

            const { id, ...totalBalance } = await totalBalanceRepository.get(
              payload.institutionId,
            );
            expect(expectedTotalBalance).toEqual(totalBalance);
          });

          it('should update monthly balance', async () => {
            const expectedMonthlyBalance = new MonthlyBalanceFactory({
              tradeEarnings: 0,
              tax: 0,
            }).getObject();

            await request(app).post('/transaction').send(payload);

            const { id, ...monthlyBalance } =
              await monthlyBalanceRepository.get(
                buyTransaction.get().getInstitutionId(),
                dateToMonthYear(buyTransaction.get().getDate()),
              );

            expect(expectedMonthlyBalance).toEqual(monthlyBalance);
          });
        });

        describe('when have tax on month to pay', () => {
          let buyTransaction;
          let payload;

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

            await request(app).post('/transaction').send(payload);

            const { id, ...monthlyBalance } =
              await monthlyBalanceRepository.get(
                buyTransaction.get().getInstitutionId(),
                dateToMonthYear(buyTransaction.get().getDate()),
              );

            expect(expectedMonthlyBalance).toEqual(monthlyBalance);
          });
        });
      });
    });
  });
});
