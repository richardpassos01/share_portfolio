import { EventEmitter } from 'events';
import { decorate, injectable } from 'inversify';

interface ISubscriber {
  emit(event: string, data?: any): void;
  on(event: string, listener: (data?: any) => void): void;
  off(event: string, listener?: (data?: any) => void): void;
  removeAllListeners(event?: string): void;
}

@injectable()
class Subscriber extends EventEmitter implements ISubscriber {}

export { ISubscriber, Subscriber };
