# API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
4. [Database Management](#database-management)
5. [Testing](#testing)
6. [Application Overview](#application-overview)
7. [Business Rules](#business-rules)
8. [Tax Calculation](#tax-calculation)
9. [How to Use the Application](#how-to-use-the-application)
10. [Trade-offs](#trade-offs)
11. [Useful Information](#useful-information)

---

## Introduction
This API is designed to calculate a user's earnings, losses, and tax obligations resulting from buying and selling shares. It also accounts for bonus shares and stock splits.

### Prerequisites
- Node.js version 20.6
- Docker Compose (for managing the database containers)
- npm (Node Package Manager)

### Getting Started
1. Start the database containers: `docker-compose up -d`
2. Install dependencies: `npm install`
3. Run the development server: `npm run development`

### Database Management
- Create migration: `npm run migration:up`
- Rollback migration: `npm run migration:down`
- Create seed: `npm run seed:create`
- Run seed: `npm run seed:run`

### Testing
- Integration tests: `npm run test:integration`
- Unit tests: `npm run test:unit`

## Application Overview
The application's main objective is to calculate a user's financial summary, including gains, losses, and tax obligations, based on their stock transactions.

### Business Rules
- If a user sells more than $20,000 in a month, they must pay taxes.
- Day trading in a month incurs tax obligations.
- Monthly losses are added to the "loss" column in the "total_balance" table.
- Monthly profits, along with taxes, are added to the "monthly_balance" table. The application dynamically calculates net wins and losses, deducting fees, losses, and taxes withheld at the source.

### Tax Calculation
- In swing trading, 15% tax is charged on the earnings, and the 0.5% tax charged by the broker is deducted. If the user has losses, this amount is also deducted from them.
- In day trading, 20% tax is charged on the earnings, and the 1% tax charged by the broker is deducted. Other rules remain the same.

### How to Use the Application
1. Start by making a POST request to `/transaction` with all the user's transactions. Alternatively, use the command to populate transactions (see details in `src/management/commands/README.md`).
2. Both the endpoint and the command call the `createTransaction` use case. It inserts transactions into the database in the correct order and then calls the `updatePortfolio` use case for each inserted transaction. It is invoked individually using a loop to ensure accurate tax calculations for previous months.
3. If a user initially inserts transactions for one month and later for a previous month, any errors or discrepancies can be resolved by resynchronizing using the `POST /institution/:institutionId/re-sync` endpoint.
4. If one or more transactions are deleted, the use case to resynchronize everything will also be invoked.
5. The user can view gains and losses through the `GET /portfolio/:institutionId` endpoint.

### Trade-offs
- Transactions must be inserted manually, which can lead to errors. To mitigate this, the resync endpoint was created. Ideally, transactions should come directly from B3 (Brazilian Stock Exchange) via webhooks or other available methods, but this API does not implement that functionality due to restrictions for non-corporate users.
- Web crawling to access B3 data is not used due to high costs and ongoing maintenance requirements. The API is designed to be ready for future implementation of the B3 API.

### Useful Information
- The API is developed in TypeScript, following clean code and clean architecture principles, making it scalable for interested parties.
- Inversify is used for dependency injection.
- KOA is employed to set up the server due to its lightweight nature.
- Joi is used for input validation.
- A SQL file is provided to demonstrate some of the more complex repository methods (`sql_file.sql`).

For any questions or issues, please contact the developers.

---

*Note: The Node.js version mentioned as "20.6" appears to be unconventional, and it's essential to provide a standard Node.js version, such as "14.x" or whichever version you are using.*
