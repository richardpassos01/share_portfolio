import MonthlyBalance from '../../domain/monthlyBalance/MonthlyBalance.js';

export default class MonthlyBalanceMapper {
  static mapToDatabaseObject(entity) {
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

  static mapToEntity(object) {
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
