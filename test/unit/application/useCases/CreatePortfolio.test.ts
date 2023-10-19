import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import { ReasonPhrases } from '@domain/shared/enums';
import CreatePortfolio from '@application/useCases/CreatePortfolio';
import NotFoundError from '@domain/shared/error/NotFoundError';
import institution from '@fixtures/institution';
import TotalBalanceRepositoryInterface from '@domain/portfolio/totalBalance/interfaces/TotalBalanceRepositoryInterface';

describe('CreatePortfolio', () => {
  let createPortfolio: CreatePortfolio;
  let totalBalanceRepository: TotalBalanceRepositoryInterface;

  beforeAll(async () => {
    createPortfolio = container.get<CreatePortfolio>(TYPES.CreatePortfolio);
    totalBalanceRepository = container.get<TotalBalanceRepositoryInterface>(
      TYPES.TotalBalanceRepository,
    );
  });

  beforeAll(() => {
    jest
      .spyOn(totalBalanceRepository, 'get')
      .mockImplementation(() => Promise.resolve(undefined));
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should throw total balance not found error when share does not exists', async () => {
    createPortfolio.execute(institution.id).catch((error) => {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(ReasonPhrases.TOTAL_BALANCE_NOT_FOUND);
    });
  });
});
