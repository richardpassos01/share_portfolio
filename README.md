1 - ao adicionar transaction manual,

atualizar lista de transactions/
atualizar quantidade/preco medio de acao na tabela shares
atualizar totalLoss/totalwins da conta

imposto do mes atual.


2 adicionar todos impostos


ganho do mes - perda total, se tiver lucro, descontar 15% swing trade e 20% daytrade
tax: {
    amount:
    date:
    type: [day_trade, swing_trade"]
    status: [owe/paid]
}


3 - criar comando que gera impostos devidos para cada mes desde que começou operação e deixar status como open. Cada imposto gerado, deve abater esse valor do total loss da conta.


4 - criar use case para alterar status do imposto, toda vez que pagar imposto





--populate
npm run management --command=populateTransactions

