import { TYPES } from '@constants/types';
import container from '@dependencyInjectionContainer';
import TransactionFactory from '@factories/TransactionFactory';
import { ReasonPhrases } from '@domain/shared/enums';
import ProcessSpecialEventsOnShare from '@application/useCases/ProcessSpecialEventsOnShare';
import GetShare from '@application/queries/GetShare';
import NotFoundError from '@domain/shared/error/NotFoundError';

describe('ProcessSpecialEventOnShare', () => {
  let processSpecialEventsOnShare: ProcessSpecialEventsOnShare;
  let getShare: GetShare;

  beforeAll(async () => {
    processSpecialEventsOnShare = container.get<ProcessSpecialEventsOnShare>(
      TYPES.ProcessSpecialEventsOnShare,
    );
    getShare = container.get<GetShare>(TYPES.GetShare);
  });

  beforeAll(() => {
    jest
      .spyOn(getShare, 'execute')
      .mockImplementation(() => Promise.resolve(undefined));
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should throw share not found error when share does not exists', async () => {
    const transaction = new TransactionFactory().get();

    processSpecialEventsOnShare.execute(transaction).catch((error) => {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(ReasonPhrases.SHARE_NOT_FOUND);
    });
  });
});
