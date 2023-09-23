import { TRANSACTION_TYPE } from '../../domain/transaction/TransactionEnums.js';

export default class UpdateInstitutionPosition {
  constructor(
    institutionRepository,
    shareRepository,
    createShare,
    updateShare,
  ) {
    Object.assign(this, {
      institutionRepository,
      shareRepository,
      createShare,
      updateShare,
    });
  }

  async execute(transaction) {
    if (transaction.type === TRANSACTION_TYPE.OUTBOUND) {
      const share = await this.shareRepository.get(
        transaction.ticketSymbol,
        transaction.institutionId,
      );

      if (!share) {
        return this.createShare.execute(transaction);
      }

      share.updateQuantity(transaction.quantity);
      share.updateTotalCost(transaction.totalPrice);
      share.updateMediumPrice();

      return this.updateShare.execute(share);
    }

    // se venda/inbound
    // verificar se teve ganho ou perca, se perca, atualizar o valor de perca geral da conta

    // se ganho,
    // verificar se é daytrade ou swing trade
    // atualizar tax do mes da share ou criar registro
    // olhar liquidation
    return this.institutionRepository.get(transaction.institutionId);
  }
}
