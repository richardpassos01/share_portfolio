import Share from '../Share';

export default interface ShareRepositoryInterface {
  get(institutionId: string, ticketSymbol: string): Promise<Share | null>;
  getAll(institutionId: string): Promise<Share[]>;
  create(share: Share): Promise<void>;
  update(share: Share): Promise<void>;
  delete(share: Share): Promise<void>;
}