import { injectable } from 'inversify';
import knex, { Knex } from 'knex';
import Config from '@config';

@injectable()
class Database {
  private instance: Knex;

  constructor() {
    this.instance = knex(Config.database);
  }

  async checkConnection(): Promise<void> {
    return this.instance.select(1);
  }

  connection(): Knex {
    return this.instance;
  }
}

export default Database;
