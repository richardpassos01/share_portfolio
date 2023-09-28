import knex from 'knex';

import KnexConfig from '../../../knexfile.js';

class Database {
  constructor(knexInstance) {
    this.knexInstance = knexInstance;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database(knex(KnexConfig));
      Database.instance.checkConnection();
    }

    return Database.instance;
  }

  checkConnection() {
    this.knexInstance
      .select(1)
      .catch((error) =>
        console.error('Error connecting to the database:', error.message),
      );
  }

  connection() {
    return this.knexInstance;
  }
}

export default Database;
