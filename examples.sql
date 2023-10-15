-- QUERY USED ON listFromMonth METHOD
WITH filtered_data AS (
  SELECT DISTINCT *
  FROM transaction
  WHERE EXTRACT(MONTH FROM date) = :MONTH
  AND EXTRACT(YEAR FROM date) = :YEAR
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
  WHERE id = :UUID
)


-- QUERY USED ON LIST TRANSACTIONS
SELECT distinct COUNT(*) OVER() AS total_count, t.*
FROM transaction t
ORDER BY date, type
LIMIT 40
OFFSET 0;


--QUERY USED TO "RESET" DATABASE
BEGIN;
DELETE FROM transaction;
DELETE FROM total_balance;
DELETE FROM monthly_balance;
DELETE FROM share;
COMMIT;
