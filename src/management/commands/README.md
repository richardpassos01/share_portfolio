#### File Sequence

If you wish to use the **populateTransactions** command, you need to add all the provided XLSX files from B3 to the src/management/files folder.

The command will read all the files in this folder, add the transactions, and call the **updatePortfolio** use case to synchronize everything.

You can either add multiple files or include all the transactions in a single XLSX file following the B3 report format. An example is available in the folder.

To avoid errors, add the files in the order provided by B3, starting with the oldest transactions and proceeding to the newest transactions. Alternatively, you can use the /re-sync endpoint after the initial insertion.


After add the files, run
`npm run management --command=populateTransactions`
