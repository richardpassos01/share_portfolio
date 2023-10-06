import { injectable } from 'inversify';
import knex, { Knex } from 'knex';
import Config from '@config';

@injectable()
class Database {
  private instance: Knex;

  constructor() {
    this.instance = knex(Config.database);
  }

  checkConnection(): void {
    this.instance.select(1).then(() => {
      console.log('database connected!');
    });
  }

  connection(): Knex {
    return this.instance;
  }
}

export default Database;
