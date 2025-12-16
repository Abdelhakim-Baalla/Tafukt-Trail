const CamionService = require('../services/camionService');
const camionRepository = require('../repositories/CamionRepository');

jest.mock('../repositories/CamionRepository');

describe('CamionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCamion', () => {
    it('should create a new camion', async () => {
      const data = { matricule: 'ABC123', marque: 'Volvo', model: 'FH16', reservoire: 500 };
      const mockCamion = { _id: '123', ...data };

      camionRepository.create.mockResolvedValue(mockCamion);

      const result = await CamionService.createCamion(data);

      expect(camionRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockCamion);
    });
  });

  describe('getAllCamions', () => {
    it('should return all camions', async () => {
      const mockCamions = [
        { _id: '1', matricule: 'ABC123', marque: 'Volvo' },
        { _id: '2', matricule: 'XYZ789', marque: 'Scania' }
      ];

      camionRepository.findAll.mockResolvedValue(mockCamions);

      const result = await CamionService.getAllCamions();

      expect(camionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCamions);
      expect(result.length).toBe(2);
    });
  });

  describe('getCamionByStatut', () => {
    it('should return camions by status', async () => {
      const mockCamions = [
        { _id: '1', matricule: 'ABC123', statut: 'DISPONIBLE' }
      ];

      camionRepository.findByStatut.mockResolvedValue(mockCamions);

      const result = await CamionService.getCamionByStatut('DISPONIBLE');

      expect(camionRepository.findByStatut).toHaveBeenCalledWith('DISPONIBLE');
      expect(result).toEqual(mockCamions);
    });
  });

  describe('getCamionById', () => {
    it('should return a camion by id', async () => {
      const mockCamion = { _id: '123', matricule: 'ABC123', marque: 'Volvo' };

      camionRepository.findById.mockResolvedValue(mockCamion);

      const result = await CamionService.getCamionById('123');

      expect(camionRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockCamion);
    });

    it('should throw error if camion not found', async () => {
      camionRepository.findById.mockResolvedValue(null);

      await expect(CamionService.getCamionById('999')).rejects.toThrow('Camion non trouvé');
    });
  });

  describe('updateCamion', () => {
    it('should update a camion', async () => {
      const id = '123';
      const data = { reservoire: 600 };
      const mockCamion = { _id: id, matricule: 'ABC123', ...data };

      camionRepository.update.mockResolvedValue(mockCamion);

      const result = await CamionService.updateCamion(id, data);

      expect(camionRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(mockCamion);
    });

    it('should throw error if camion not found during update', async () => {
      camionRepository.update.mockResolvedValue(null);

      await expect(CamionService.updateCamion('999', {})).rejects.toThrow('Camion non trouvé');
    });
  });

  describe('deleteCamion', () => {
    it('should delete a camion', async () => {
      const mockCamion = { _id: '123', matricule: 'ABC123' };

      camionRepository.delete.mockResolvedValue(mockCamion);

      const result = await CamionService.deleteCamion('123');

      expect(camionRepository.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockCamion);
    });

    it('should throw error if camion not found during delete', async () => {
      camionRepository.delete.mockResolvedValue(null);

      await expect(CamionService.deleteCamion('999')).rejects.toThrow('Camion non trouvé');
    });
  });
});
