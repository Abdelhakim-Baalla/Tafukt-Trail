const CamionService = require('../../../services/camionService');
const camionRepository = require('../../../repositories/CamionRepository');

jest.mock('../../../repositories/CamionRepository');

describe('CamionService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCamion', () => {
    it('should create camion', async () => {
      const data = { matricule: 'ABC123', marque: 'Volvo', reservoire: 500 };
      const mockCamion = { _id: '1', ...data };

      camionRepository.create.mockResolvedValue(mockCamion);

      const result = await CamionService.createCamion(data);

      expect(result).toEqual(mockCamion);
    });
  });

  describe('getAllCamions', () => {
    it('should get all camions', async () => {
      const mockCamions = [
        { _id: '1', matricule: 'ABC123' },
        { _id: '2', matricule: 'XYZ789' }
      ];

      camionRepository.findAll.mockResolvedValue(mockCamions);

      const result = await CamionService.getAllCamions();

      expect(result).toEqual(mockCamions);
      expect(result.length).toBe(2);
    });
  });

  describe('getCamionById', () => {
    it('should get camion by id', async () => {
      const mockCamion = { _id: '1', matricule: 'ABC123' };

      camionRepository.findById.mockResolvedValue(mockCamion);

      const result = await CamionService.getCamionById('1');

      expect(result).toEqual(mockCamion);
    });

    it('should throw if not found', async () => {
      camionRepository.findById.mockResolvedValue(null);

      await expect(CamionService.getCamionById('999'))
        .rejects.toThrow('Camion non trouvé');
    });
  });

  describe('updateCamion', () => {
    it('should update camion', async () => {
      const mockCamion = { _id: '1', matricule: 'ABC123', reservoire: 600 };

      camionRepository.update.mockResolvedValue(mockCamion);

      const result = await CamionService.updateCamion('1', { reservoire: 600 });

      expect(result).toEqual(mockCamion);
    });

    it('should throw if not found', async () => {
      camionRepository.update.mockResolvedValue(null);

      await expect(CamionService.updateCamion('999', {}))
        .rejects.toThrow('Camion non trouvé');
    });
  });

  describe('deleteCamion', () => {
    it('should delete camion', async () => {
      const mockCamion = { _id: '1', matricule: 'ABC123' };

      camionRepository.delete.mockResolvedValue(mockCamion);

      const result = await CamionService.deleteCamion('1');

      expect(result).toEqual(mockCamion);
    });

    it('should throw if not found', async () => {
      camionRepository.delete.mockResolvedValue(null);

      await expect(CamionService.deleteCamion('999'))
        .rejects.toThrow('Camion non trouvé');
    });
  });
});
