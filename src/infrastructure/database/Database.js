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

  async checkConnection() {
    return this.knexInstance.select(1).then(() => {
      console.log('database connected!');
    });
  }

  connection() {
    return this.knexInstance;
  }

  disconnect() {
    this.knexInstance.destroy(() => console.log('database disconnected'));
  }
}

export default Database;
