import { uuid } from 'uuidv4';

export default class Institution {
  constructor(
    private readonly id = uuid(),
    private readonly name: string,
    private readonly userId: string,
  ) {}

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
