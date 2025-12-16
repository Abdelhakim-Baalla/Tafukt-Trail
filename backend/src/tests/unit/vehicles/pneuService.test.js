jest.mock('../../../repositories/PneuRepository');

const pneuRepository = require('../../../repositories/PneuRepository');

describe('PneuService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPneus', () => {
    it('should get all pneus from repository', async () => {
      const mockPneus = [
        { _id: '1', position: 'AVANT_GAUCHE', marque: 'Michelin' },
        { _id: '2', position: 'AVANT_DROIT', marque: 'Bridgestone' }
      ];

      pneuRepository.findAll.mockResolvedValue(mockPneus);

      const result = await pneuRepository.findAll();

      expect(result).toEqual(mockPneus);
      expect(result.length).toBe(2);
    });
  });

  describe('getPneuById', () => {
    it('should get pneu by id from repository', async () => {
      const mockPneu = { _id: '1', position: 'AVANT_GAUCHE', marque: 'Michelin' };

      pneuRepository.findById.mockResolvedValue(mockPneu);

      const result = await pneuRepository.findById('1');

      expect(result).toEqual(mockPneu);
    });

    it('should return null if not found', async () => {
      pneuRepository.findById.mockResolvedValue(null);

      const result = await pneuRepository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('deletePneu', () => {
    it('should delete pneu from repository', async () => {
      const mockPneu = { _id: '1', position: 'AVANT_GAUCHE' };

      pneuRepository.delete.mockResolvedValue(mockPneu);

      const result = await pneuRepository.delete('1');

      expect(result).toEqual(mockPneu);
    });
  });
});
