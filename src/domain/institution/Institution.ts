import { v4 as uuid } from 'uuid';

export default class Institution {
  constructor(
    public readonly name: string,
    public readonly userId: string,
    public readonly id = uuid(),
  ) {}
}
