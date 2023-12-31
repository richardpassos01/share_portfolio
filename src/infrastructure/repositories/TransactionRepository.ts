import TransactionMapper from '@infrastructure/mappers/TransactionMapper';
import { TYPES } from '@constants/types';
import TransactionRepositoryInterface from '@domain/transaction/interfaces/TransactionRepositoryInterface';
import Database, { TABLES } from '@infrastructure/database';
import { inject, injectable } from 'inversify';
import Transaction from '@domain/transaction/Transaction';
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@domain/shared/enums';
import Pagination, { MapperFunction } from '@domain/shared/Pagination';
import { SortOrder, TransactionDTO } from '@domain/shared/types';

@injectable()
export default class TransactionRepository
  implements TransactionRepositoryInterface
{
  constructor(
    @inject(TYPES.Database)
    private readonly database: Database,
  ) {}

  async createMany(transactions: Transaction[]) {
    await this.database
      .connection()
      .insert(transactions.map(TransactionMapper.mapToDatabaseObject))
      .into(TABLES.TRANSACTION);
  }

  async delete(institutionId: string, ids: string[]) {
    await this.database
      .connection()
      .where('institution_id', institutionId)
      .whereIn('id', ids)
      .del()
      .into(TABLES.TRANSACTION);
  }

  async list(
    institutionId: string,
    page = 1,
    limit = 100,
    order: SortOrder = 'asc',
    ticketSymbols?: string[],
    monthYears?: string[],
  ) {
    const query = this.database
      .connection()
      .select(
        this.database.connection().raw('COUNT(*) OVER() as total_count'),
        `${TABLES.TRANSACTION}.*`,
      )
      .where('institution_id', institutionId)
      .into(TABLES.TRANSACTION)
      .distinct()
      .orderBy([{ column: 'date', order }, 'type', 'ticket_symbol'])
      .limit(limit)
      .offset((page - 1) * limit);

    if (ticketSymbols?.length) {
      void query.whereIn('ticket_symbol', ticketSymbols);
    }

    if (monthYears?.length) {
      const dateConditions = monthYears.map((monthYear) => {
        const [year, month] = monthYear.split('-');
        return {
          year: parseInt(year),
          month: parseInt(month),
        };
      });

      void query.where((builder) => {
        for (const condition of dateConditions) {
          void builder.orWhereRaw(
            'EXTRACT(YEAR FROM date) = ? AND EXTRACT(MONTH FROM date) = ?',
            [condition.year, condition.month],
          );
        }
      });
    }

    return query.then(
      (data) =>
        new Pagination(
          page,
          limit,
          data,
          TransactionMapper.mapToEntity as MapperFunction,
        ),
    );
  }

  async listTradesFromSameMonth({ institutionId, date }: TransactionDTO) {
    return this.database
      .connection()
      .select('*')
      .distinct()
      .where({
        category: TRANSACTION_CATEGORY.TRADE,
        institution_id: institutionId,
      })
      .andWhere((builder) => {
        void builder
          .where('type', TRANSACTION_TYPE.BUY)
          .orWhere('type', TRANSACTION_TYPE.SELL);
      })
      .whereRaw(
        'EXTRACT(YEAR FROM date) = ? AND EXTRACT(MONTH FROM date) = ?',
        [date.getFullYear(), date.getMonth() + 1],
      )
      .orderBy(['date', 'type', 'ticket_symbol'])
      .from(TABLES.TRANSACTION)
      .then(
        (data) =>
          data?.map((transaction) =>
            TransactionMapper.mapToEntity(transaction),
          ),
      );
  }

  async listMonthYears(institutionId: string) {
    return this.database
      .connection()
      .select(
        this.database
          .connection()
          .raw(
            "DISTINCT TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS monthyear",
          ),
      )
      .where('institution_id', institutionId)
      .orderBy('monthyear', 'desc')
      .into(TABLES.TRANSACTION)
      .then((data) => data.map((item) => item.monthyear));
  }

  async listTicketSymbols(institutionId: string) {
    return this.database
      .connection()
      .select('ticket_symbol as ticketsymbol')
      .distinct()
      .where('institution_id', institutionId)
      .orderBy('ticketsymbol', 'asc')
      .into(TABLES.TRANSACTION)
      .then((data) => data.map((item) => item.ticketsymbol));
  }
}
