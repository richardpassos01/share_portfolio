import MonthlyBalance from '@domain/monthlyBalance/MonthlyBalance';

type MapToEntityInput = {
  id: string;
  institutionId: string;
  yearMonth: string;
  tradeEarnings: string;
  dividendEarnings: string;
  tax: number;
  taxWithholding: number;
  loss: number;
  type: string;
};


export default class MonthlyBalanceMapper {
  static mapToDatabaseObject(entity: MonthlyBalance) {
    return {
      id: entity.id,
      institution_id: entity.institutionId,
      year_month: entity.yearMonth,
      trade_earnings: entity.tradeEarnings,
      dividend_earnings: entity.dividendEarnings,
      tax: entity.tax,
      tax_withholding: entity.taxWithholding,
      loss: entity.loss,
      type: entity.type,
    };
  }

  static mapToEntity(object: MapToEntityInput) {
    return new MonthlyBalance({
      id: object.id,
      institutionId: object.institution_id,
      yearMonth: object.year_month,
      tradeEarnings: object.trade_earnings,
      dividendEarnings: object.dividend_earnings,
      tax: object.tax,
      taxWithholding: object.tax_withholding,
      loss: object.loss,
      type: object.type,
    });
  }
}
