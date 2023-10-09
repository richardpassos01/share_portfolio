import MonthlyBalance from '@domain/financialReport/monthlyBalance/MonthlyBalance';
import { MONTHLY_BALANCE_TYPE } from '@domain/financialReport/monthlyBalance/MonthlyBalanceEnums';

type MapToEntityInput = {
  institution_id: string;
  year_month: string;
  trade_earning: number;
  dividend_earning: number;
  tax: number;
  tax_withholding: number;
  loss: number;
  type: MONTHLY_BALANCE_TYPE;
};

export default class MonthlyBalanceMapper {
  static mapToDatabaseObject(entity: MonthlyBalance): MapToEntityInput {
    return {
      institution_id: entity.institutionId,
      year_month: entity.yearMonth,
      trade_earning: entity.tradeEarning,
      dividend_earning: entity.dividendEarning,
      tax: entity.tax,
      tax_withholding: entity.taxWithholding,
      loss: entity.loss,
      type: entity.type,
    };
  }

  static mapToEntity(object: MapToEntityInput): MonthlyBalance {
    return new MonthlyBalance(
      object.institution_id,
      object.year_month,
      object.trade_earning,
      object.dividend_earning,
      object.tax,
      object.tax_withholding,
      object.loss,
      object.type,
    );
  }
}
