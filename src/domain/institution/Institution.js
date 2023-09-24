import { v4 as uuid } from 'uuid';

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
