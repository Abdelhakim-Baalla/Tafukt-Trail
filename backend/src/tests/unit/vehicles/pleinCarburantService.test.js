jest.mock('../../../repositories/PleinCarburantRepository');
jest.mock('../../../models/PleinCarburant', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../../../models/Trajet', () => ({
  find: jest.fn(),
}));
jest.mock('../../../models/Camion', () => ({
  findById: jest.fn(),
}));

const pleinCarburantService = require('../../../services/pleinCarburantService');
const pleinCarburantRepository = require('../../../repositories/PleinCarburantRepository');
const PleinCarburant = require('../../../models/PleinCarburant');
const Trajet = require('../../../models/Trajet');
const Camion = require('../../../models/Camion');

describe('PleinCarburantService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlein', () => {
    it('should create plein and add quantite to camion reservoire', async () => {
      const data = { camion: 'camion1', quantiteLitre: 100, prixLitre: 10 };
      const camion = { _id: 'camion1', reservoire: 200, save: jest.fn().mockResolvedValue(true) };
      const mockPlein = { _id: '1', ...data };

      Camion.findById.mockResolvedValue(camion);
      pleinCarburantRepository.create.mockResolvedValue(mockPlein);

      const result = await pleinCarburantService.createPlein(data);

      expect(result).toEqual(mockPlein);
      expect(camion.reservoire).toBe(300);
      expect(camion.save).toHaveBeenCalled();
      expect(pleinCarburantRepository.create).toHaveBeenCalledWith(data);
    });

    it('should throw if camion not found', async () => {
      Camion.findById.mockResolvedValue(null);

      await expect(
        pleinCarburantService.createPlein({ camion: '999', quantiteLitre: 50 })
      ).rejects.toThrow('Camion non trouvé');
    });
  });

  describe('getRapports', () => {
    it('should compute global totals and consommation moyenne', async () => {
      const camionId = 'camion1';
      const pleins = [
        { quantiteLitre: 100, montantTotal: 1000, camion: { _id: { toString: () => camionId } } },
        { quantiteLitre: 50, montantTotal: 500, camion: { _id: { toString: () => camionId } } },
      ];
      const trajets = [
        {
          kilometrageDepart: 1000,
          kilometrageArrivee: 1500,
          carburantNiveauxDepart: 200,
          carburantNiveauxArrivee: 150,
          camion: { _id: { toString: () => camionId } },
        },
      ];

      PleinCarburant.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(pleins) });
      Trajet.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(trajets) });

      const result = await pleinCarburantService.getRapports();

      expect(result.global.totalLitres).toBe(150);
      expect(result.global.totalMontant).toBe(1500);
      expect(result.global.nombrePleins).toBe(2);
      expect(result.global.totalKilometrage).toBe(500);
      expect(result.global.totalCarburantConsomme).toBe(50);
      expect(result.global.consommationMoyenne).toBe(10);
      expect(result.parCamion).toHaveLength(1);
      expect(result.parCamion[0].consommationMoyenne).toBe(10);
    });

    it('should return zeros when no data', async () => {
      PleinCarburant.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
      Trajet.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });

      const result = await pleinCarburantService.getRapports();

      expect(result.global.totalLitres).toBe(0);
      expect(result.global.consommationMoyenne).toBe(0);
      expect(result.parCamion).toHaveLength(0);
    });
  });
});
