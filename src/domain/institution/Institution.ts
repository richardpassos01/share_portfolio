import { uuid } from 'uuidv4';

export default class Institution {
  constructor(
    private readonly name: string,
    private readonly userId: string,
    private readonly id = uuid(),
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
