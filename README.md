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



-- LIST FROM MONTH

WITH filtered_data AS (
  SELECT DISTINCT *
  FROM transaction
  WHERE EXTRACT(MONTH FROM date) = 8
  AND EXTRACT(YEAR FROM date) = 2019
  AND category = 'TRADE'
  ORDER BY date, type
),
subquery AS (
    SELECT *,
    ROW_NUMBER() OVER () AS row_number
    FROM filtered_data
)
SELECT * FROM subquery WHERE row_number <= (
  SELECT row_number
  FROM subquery
  WHERE id = '355f8c6b-f056-4445-936e-a1be49142a4d'
)


-- PAGINATED LIST

SELECT distinct COUNT(*) OVER() AS total_count, t.*
FROM transaction t
ORDER BY date, type
LIMIT 40
OFFSET 0;


--RESET DATABASE
BEGIN;

UPDATE total_balance SET 
loss = 0;
DELETE FROM transaction;
DELETE FROM monthly_balance;
DELETE FROM share;

COMMIT;



--populate
npm run management --command=populateTransactions
