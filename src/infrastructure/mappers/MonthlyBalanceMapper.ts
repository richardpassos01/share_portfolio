import MonthlyBalance from '@domain/monthlyBalance/MonthlyBalance';
import { MONTHLY_BALANCE_TYPE } from '@domain/monthlyBalance/MonthlyBalanceEnums';

type MapToEntityInput = {
  id: string;
  institution_id: string;
  year_month: string;
  trade_earnings: number;
  dividend_earnings: number;
  tax: number;
  tax_withholding: number;
  loss: number;
  type: MONTHLY_BALANCE_TYPE;
};

export default class MonthlyBalanceMapper {
  static mapToDatabaseObject(entity: MonthlyBalance): MapToEntityInput {
    return {
      id: entity.getId(),
      institution_id: entity.getInstitutionId(),
      year_month: entity.getYearMonth(),
      trade_earnings: entity.getTradeEarnings(),
      dividend_earnings: entity.getDividendEarnings(),
      tax: entity.getTax(),
      tax_withholding: entity.getTaxWithholding(),
      loss: entity.getLoss(),
      type: entity.getType(),
    };
  }

  static mapToEntity(object: MapToEntityInput): MonthlyBalance {
    return new MonthlyBalance(
      object.id,
      object.institution_id,
      object.year_month,
      object.trade_earnings,
      object.dividend_earnings,
      object.tax,
      object.tax_withholding,
      object.loss,
      object.type,
    );
  }
}
