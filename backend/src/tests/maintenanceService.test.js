const MaintenanceService = require('../services/maintenanceService');
const interventionMaintenanceRepository = require('../repositories/InterventionMaintenanceRepository');
const regleMaintenanceRepository = require('../repositories/RegleMaintenanceRepository');
const Camion = require('../models/Camion');

jest.mock('../repositories/InterventionMaintenanceRepository');
jest.mock('../repositories/RegleMaintenanceRepository');
jest.mock('../models/Camion');

describe('MaintenanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createIntervention', () => {
    it('should create a new maintenance intervention', async () => {
      const data = {
        camion: '123',
        type: 'VIDANGE',
        dateIntervention: new Date('2025-01-15'),
        kilometrage: 50000
      };
      const mockIntervention = { _id: '456', ...data };

      interventionMaintenanceRepository.create.mockResolvedValue(mockIntervention);

      const result = await MaintenanceService.createIntervention(data);

      expect(interventionMaintenanceRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockIntervention);
    });
  });

  describe('getAllInterventions', () => {
    it('should return all maintenance interventions', async () => {
      const mockInterventions = [
        { _id: '1', type: 'VIDANGE', camion: '123' },
        { _id: '2', type: 'REVISION', camion: '456' }
      ];

      interventionMaintenanceRepository.findAll.mockResolvedValue(mockInterventions);

      const result = await MaintenanceService.getAllInterventions();

      expect(interventionMaintenanceRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockInterventions);
      expect(result.length).toBe(2);
    });
  });

  describe('getInterventionById', () => {
    it('should return an intervention by id', async () => {
      const mockIntervention = { _id: '456', type: 'VIDANGE', camion: '123' };

      interventionMaintenanceRepository.findById.mockResolvedValue(mockIntervention);

      const result = await MaintenanceService.getInterventionById('456');

      expect(interventionMaintenanceRepository.findById).toHaveBeenCalledWith('456');
      expect(result).toEqual(mockIntervention);
    });

    it('should throw error if intervention not found', async () => {
      interventionMaintenanceRepository.findById.mockResolvedValue(null);

      await expect(MaintenanceService.getInterventionById('999')).rejects.toThrow('Intervention non trouvée');
    });
  });

  describe('updateIntervention', () => {
    it('should update an intervention', async () => {
      const id = '456';
      const data = { statut: 'COMPLETEE' };
      const mockIntervention = { _id: id, type: 'VIDANGE', ...data };

      interventionMaintenanceRepository.findById.mockResolvedValue(mockIntervention);
      interventionMaintenanceRepository.update.mockResolvedValue(mockIntervention);

      const result = await MaintenanceService.updateIntervention(id, data);

      expect(interventionMaintenanceRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(mockIntervention);
    });

    it('should throw error if intervention not found during update', async () => {
      interventionMaintenanceRepository.findById.mockResolvedValue(null);

      await expect(MaintenanceService.updateIntervention('999', {})).rejects.toThrow('Intervention non trouvée');
    });
  });

  describe('deleteIntervention', () => {
    it('should delete an intervention', async () => {
      const mockIntervention = { _id: '456', type: 'VIDANGE' };

      interventionMaintenanceRepository.delete.mockResolvedValue(mockIntervention);

      const result = await MaintenanceService.deleteIntervention('456');

      expect(interventionMaintenanceRepository.delete).toHaveBeenCalledWith('456');
      expect(result).toEqual(mockIntervention);
    });

    it('should throw error if intervention not found during delete', async () => {
      interventionMaintenanceRepository.delete.mockResolvedValue(null);

      await expect(MaintenanceService.deleteIntervention('999')).rejects.toThrow('Intervention non trouvée');
    });
  });

  describe('createRegleMaintenance', () => {
    it('should create a new maintenance rule', async () => {
      const data = {
        type: 'VIDANGE',
        periodiciteKm: 50000,
        periodiciteJours: 365
      };
      const mockRegle = { _id: '789', ...data };

      regleMaintenanceRepository.create.mockResolvedValue(mockRegle);

      const result = await MaintenanceService.createRegleMaintenance(data);

      expect(regleMaintenanceRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockRegle);
    });
  });

  describe('getAllRegles', () => {
    it('should return all maintenance rules', async () => {
      const mockRegles = [
        { _id: '1', type: 'VIDANGE', periodiciteKm: 50000 },
        { _id: '2', type: 'REVISION', periodiciteKm: 100000 }
      ];

      regleMaintenanceRepository.findAll.mockResolvedValue(mockRegles);

      const result = await MaintenanceService.getAllRegles();

      expect(regleMaintenanceRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRegles);
      expect(result.length).toBe(2);
    });
  });

  describe('getRegleById', () => {
    it('should return a maintenance rule by id', async () => {
      const mockRegle = { _id: '789', type: 'VIDANGE', periodiciteKm: 50000 };

      regleMaintenanceRepository.findById.mockResolvedValue(mockRegle);

      const result = await MaintenanceService.getRegleById('789');

      expect(regleMaintenanceRepository.findById).toHaveBeenCalledWith('789');
      expect(result).toEqual(mockRegle);
    });

    it('should throw error if rule not found', async () => {
      regleMaintenanceRepository.findById.mockResolvedValue(null);

      await expect(MaintenanceService.getRegleById('999')).rejects.toThrow('Règle non trouvée');
    });
  });

  describe('updateRegleMaintenance', () => {
    it('should update a maintenance rule', async () => {
      const id = '789';
      const data = { periodiciteKm: 60000 };
      const mockRegle = { _id: id, type: 'VIDANGE', ...data };

      regleMaintenanceRepository.findById.mockResolvedValue(mockRegle);
      regleMaintenanceRepository.update.mockResolvedValue(mockRegle);

      const result = await MaintenanceService.updateRegleMaintenance(id, data);

      expect(regleMaintenanceRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(mockRegle);
    });

    it('should throw error if rule not found during update', async () => {
      regleMaintenanceRepository.findById.mockResolvedValue(null);

      await expect(MaintenanceService.updateRegleMaintenance('999', {})).rejects.toThrow('Règle non trouvée');
    });
  });

  describe('deleteRegleMaintenance', () => {
    it('should delete a maintenance rule', async () => {
      const mockRegle = { _id: '789', type: 'VIDANGE' };

      regleMaintenanceRepository.delete.mockResolvedValue(mockRegle);

      const result = await MaintenanceService.deleteRegleMaintenance('789');

      expect(regleMaintenanceRepository.delete).toHaveBeenCalledWith('789');
      expect(result).toEqual(mockRegle);
    });

    it('should throw error if rule not found during delete', async () => {
      regleMaintenanceRepository.delete.mockResolvedValue(null);

      await expect(MaintenanceService.deleteRegleMaintenance('999')).rejects.toThrow('Règle non trouvée');
    });
  });
});
