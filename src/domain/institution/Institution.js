import { uuid } from 'uuidv4';

export default class Institution {
  constructor({ id = uuid(), name, userId }) {
    this.id = id;
    this.name = name;
    this.userId = userId;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getUserId() {
    return this.userId;
  }
}
