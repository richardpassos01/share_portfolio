import MonthlyBalance from '@domain/balance/monthlyBalance/MonthlyBalance';
import { MONTHLY_BALANCE_TYPE } from '@domain/balance/monthlyBalance/MonthlyBalanceEnums';

type MapToEntityInput = {
  institution_id: string;
  year_month: string;
  trade_earning: number;
  dividend_earning: number;
  tax: number;
  tax_withholding: number;
  tax_gross: number;
  loss: number;
  total_sold: number;
  restitution: number;
  current_total_loss: number;
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
      tax_gross: entity.taxGross,
      loss: entity.loss,
      total_sold: entity.totalSold,
      restitution: entity.restitution,
      current_total_loss: entity.currentTotalLoss,
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
      object.tax_gross,
      object.loss,
      object.total_sold,
      object.restitution,
      object.current_total_loss,
      object.type,
    );
  }
}
