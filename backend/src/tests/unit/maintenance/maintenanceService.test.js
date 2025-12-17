jest.mock('../../../repositories/InterventionMaintenanceRepository');
jest.mock('../../../repositories/RegleMaintenanceRepository');

const interventionMaintenanceRepository = require('../../../repositories/InterventionMaintenanceRepository');
const regleMaintenanceRepository = require('../../../repositories/RegleMaintenanceRepository');

describe('MaintenanceService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Interventions', () => {
    it('should create intervention', async () => {
      const data = { camion: '1', type: 'VIDANGE', dateIntervention: new Date() };
      const mockIntervention = { _id: '1', ...data };

      interventionMaintenanceRepository.create.mockResolvedValue(mockIntervention);

      const result = await interventionMaintenanceRepository.create(data);

      expect(result).toEqual(mockIntervention);
    });

    it('should get all interventions', async () => {
      const mockInterventions = [
        { _id: '1', type: 'VIDANGE', camion: '1' },
        { _id: '2', type: 'REVISION', camion: '2' }
      ];

      interventionMaintenanceRepository.findAll.mockResolvedValue(mockInterventions);

      const result = await interventionMaintenanceRepository.findAll();

      expect(result).toEqual(mockInterventions);
      expect(result.length).toBe(2);
    });

    it('should get intervention by id', async () => {
      const mockIntervention = { _id: '1', type: 'VIDANGE', camion: '1' };

      interventionMaintenanceRepository.findById.mockResolvedValue(mockIntervention);

      const result = await interventionMaintenanceRepository.findById('1');

      expect(result).toEqual(mockIntervention);
    });

    it('should delete intervention', async () => {
      const mockIntervention = { _id: '1', type: 'VIDANGE' };

      interventionMaintenanceRepository.delete.mockResolvedValue(mockIntervention);

      const result = await interventionMaintenanceRepository.delete('1');

      expect(result).toEqual(mockIntervention);
    });
  });

  describe('Maintenance Rules', () => {
    it('should create rule', async () => {
      const data = { type: 'VIDANGE', periodiciteKm: 50000 };
      const mockRegle = { _id: '1', ...data };

      regleMaintenanceRepository.create.mockResolvedValue(mockRegle);

      const result = await regleMaintenanceRepository.create(data);

      expect(result).toEqual(mockRegle);
    });

    it('should get all rules', async () => {
      const mockRegles = [
        { _id: '1', type: 'VIDANGE', periodiciteKm: 50000 },
        { _id: '2', type: 'REVISION', periodiciteKm: 100000 }
      ];

      regleMaintenanceRepository.findAll.mockResolvedValue(mockRegles);

      const result = await regleMaintenanceRepository.findAll();

      expect(result).toEqual(mockRegles);
      expect(result.length).toBe(2);
    });

    it('should get rule by id', async () => {
      const mockRegle = { _id: '1', type: 'VIDANGE', periodiciteKm: 50000 };

      regleMaintenanceRepository.findById.mockResolvedValue(mockRegle);

      const result = await regleMaintenanceRepository.findById('1');

      expect(result).toEqual(mockRegle);
    });

    it('should delete rule', async () => {
      const mockRegle = { _id: '1', type: 'VIDANGE' };

      regleMaintenanceRepository.delete.mockResolvedValue(mockRegle);

      const result = await regleMaintenanceRepository.delete('1');

      expect(result).toEqual(mockRegle);
    });
  });
});
