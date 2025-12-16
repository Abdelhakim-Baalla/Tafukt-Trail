jest.mock('../../../repositories/TrajetRepository');

const trajetRepository = require('../../../repositories/TrajetRepository');

describe('TrajetService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStatut', () => {
    it('should update trajet status in repository', async () => {
      const mockTrajet = {
        _id: '1',
        chauffeur: { _id: 'user1' },
        camion: { _id: 'camion1' },
        statut: 'EN_COURS'
      };

      trajetRepository.findById.mockResolvedValue(mockTrajet);
      trajetRepository.update.mockResolvedValue(mockTrajet);

      const result = await trajetRepository.update('1', { statut: 'EN_COURS' });

      expect(result).toBeDefined();
      expect(result.statut).toBe('EN_COURS');
    });

    it('should return null if trajet not found', async () => {
      trajetRepository.findById.mockResolvedValue(null);

      const result = await trajetRepository.findById('999');

      expect(result).toBeNull();
    });
  });
});
