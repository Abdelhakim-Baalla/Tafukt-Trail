jest.mock('../../../repositories/PneuRepository');
jest.mock('../../../models/Camion', () => ({
  findById: jest.fn(),
}));

const pneuService = require('../../../services/pneuService');
const pneuRepository = require('../../../repositories/PneuRepository');
const Camion = require('../../../models/Camion');

describe('PneuService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPneu', () => {
    it('should create pneu', async () => {
      const data = { position: 'AVANT_GAUCHE', marque: 'Michelin', camion: 'camion1' };
      const mockPneu = { _id: '1', ...data };

      pneuRepository.findAll.mockResolvedValue([]);
      pneuRepository.findByPosition.mockResolvedValue([]);
      Camion.findById.mockResolvedValue({ _id: 'camion1', matricule: 'MA-1' });
      pneuRepository.create.mockResolvedValue(mockPneu);

      const result = await pneuService.createPneu(data);

      expect(result).toEqual(mockPneu);
      expect(pneuRepository.create).toHaveBeenCalledWith(data);
    });

    it('should throw if pneu already exists at position for camion', async () => {
      pneuRepository.findAll.mockResolvedValue([]);
      pneuRepository.findByPosition.mockResolvedValue([
        { _id: '9', position: 'AVANT_GAUCHE', camion: { _id: 'camion1' } },
      ]);
      Camion.findById.mockResolvedValue({ _id: 'camion1', matricule: 'MA-1', marque: 'Volvo', model: 'FH16' });

      await expect(
        pneuService.createPneu({ position: 'AVANT_GAUCHE', marque: 'Michelin', camion: 'camion1' })
      ).rejects.toThrow('Pneu deja existant dans cette position');
    });
  });

  describe('getAllPneus', () => {
    it('should get all pneus', async () => {
      const mockPneus = [
        { _id: '1', position: 'AVANT_GAUCHE', marque: 'Michelin' },
        { _id: '2', position: 'AVANT_DROIT', marque: 'Bridgestone' },
      ];

      pneuRepository.findAll.mockResolvedValue(mockPneus);

      const result = await pneuService.getAllPneus();

      expect(result).toEqual(mockPneus);
      expect(result.length).toBe(2);
    });
  });

  describe('getPneuById', () => {
    it('should get pneu by id', async () => {
      const mockPneu = { _id: '1', position: 'AVANT_GAUCHE', marque: 'Michelin' };

      pneuRepository.findById.mockResolvedValue(mockPneu);

      const result = await pneuService.getPneuById('1');

      expect(result).toEqual(mockPneu);
    });

    it('should throw if not found', async () => {
      pneuRepository.findById.mockResolvedValue(null);

      await expect(pneuService.getPneuById('999'))
        .rejects.toThrow('Pneu non trouvé');
    });
  });

  describe('updatePneu', () => {
    it('should update pneu wear fields', async () => {
      pneuRepository.findById.mockResolvedValue({ _id: '1', position: 'AVANT_GAUCHE', camion: 'camion1' });
      const mockUpdated = { _id: '1', usurePourcent: 25, kilometragePose: 5000 };
      pneuRepository.update.mockResolvedValue(mockUpdated);

      const result = await pneuService.updatePneu('1', { usurePourcent: 25, kilometragePose: 5000 });

      expect(result).toEqual(mockUpdated);
      expect(pneuRepository.update).toHaveBeenCalledWith('1', { usurePourcent: 25, kilometragePose: 5000 });
    });

    it('should throw if not found', async () => {
      pneuRepository.findById.mockResolvedValue(null);

      await expect(pneuService.updatePneu('999', { usurePourcent: 10 }))
        .rejects.toThrow('Pneu non trouvé');
    });
  });

  describe('deletePneu', () => {
    it('should delete pneu', async () => {
      const mockPneu = { _id: '1', position: 'AVANT_GAUCHE' };

      pneuRepository.delete.mockResolvedValue(mockPneu);

      const result = await pneuService.deletePneu('1');

      expect(result).toEqual(mockPneu);
    });

    it('should throw if not found', async () => {
      pneuRepository.delete.mockResolvedValue(null);

      await expect(pneuService.deletePneu('999'))
        .rejects.toThrow('Pneu non trouvé');
    });
  });
});
