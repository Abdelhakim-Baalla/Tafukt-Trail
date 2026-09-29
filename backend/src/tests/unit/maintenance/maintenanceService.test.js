jest.mock('../../../repositories/InterventionMaintenanceRepository');
jest.mock('../../../repositories/RegleMaintenanceRepository');
jest.mock('../../../models/Camion', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../../../models/Trajet', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

const maintenanceService = require('../../../services/maintenanceService');
const interventionMaintenanceRepository = require('../../../repositories/InterventionMaintenanceRepository');
const regleMaintenanceRepository = require('../../../repositories/RegleMaintenanceRepository');
const Camion = require('../../../models/Camion');
const Trajet = require('../../../models/Trajet');

describe('MaintenanceService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSort = (value) => ({ sort: jest.fn().mockResolvedValue(value) });

  describe('Interventions', () => {
    it('should create intervention', async () => {
      const data = { camion: '1', type: 'VIDANGE', dateIntervention: new Date() };
      const mockIntervention = { _id: '1', ...data };

      interventionMaintenanceRepository.create.mockResolvedValue(mockIntervention);

      const result = await maintenanceService.createIntervention(data);

      expect(result).toEqual(mockIntervention);
    });

    it('should get all interventions', async () => {
      const mockInterventions = [
        { _id: '1', type: 'VIDANGE', camion: '1' },
        { _id: '2', type: 'REVISION', camion: '2' },
      ];

      interventionMaintenanceRepository.findAll.mockResolvedValue(mockInterventions);

      const result = await maintenanceService.getAllInterventions();

      expect(result).toEqual(mockInterventions);
      expect(result.length).toBe(2);
    });

    it('should get interventions by camion', async () => {
      const mockInterventions = [{ _id: '1', type: 'VIDANGE', camion: '1' }];

      interventionMaintenanceRepository.findByCamion.mockResolvedValue(mockInterventions);

      const result = await maintenanceService.getInterventionsByCamion('1');

      expect(result).toEqual(mockInterventions);
      expect(interventionMaintenanceRepository.findByCamion).toHaveBeenCalledWith('1');
    });
  });

  describe('Regles', () => {
    it('should create rule', async () => {
      const data = { typeVehicule: 'CAMION', typeIntervention: 'VIDANGE', intervalleKilometres: 10000 };
      const mockRegle = { _id: '1', ...data };

      regleMaintenanceRepository.create.mockResolvedValue(mockRegle);

      const result = await maintenanceService.createRegle(data);

      expect(result).toEqual(mockRegle);
    });

    it('should get all rules', async () => {
      const mockRegles = [
        { _id: '1', typeVehicule: 'CAMION', typeIntervention: 'VIDANGE', intervalleKilometres: 10000 },
      ];

      regleMaintenanceRepository.findAll.mockResolvedValue(mockRegles);

      const result = await maintenanceService.getAllRegles();

      expect(result).toEqual(mockRegles);
    });
  });

  describe('verifierMaintenancePreventive', () => {
    it('should generate legacy alert when threshold exceeded', async () => {
      Camion.find.mockResolvedValue([{ _id: 'camion1', matricule: 'MA-1' }]);
      Trajet.findOne.mockReturnValue(mockSort({ kilometrageArrivee: 50000 }));
      regleMaintenanceRepository.findAll.mockResolvedValue([
        { typeVehicule: 'CAMION', typeIntervention: 'VIDANGE', intervalleKilometres: 10000 },
      ]);
      interventionMaintenanceRepository.getLastIntervention.mockResolvedValue({
        kilometrageVehicule: 10000,
      });

      const alertes = await maintenanceService.verifierMaintenancePreventive();

      const legacy = alertes.find((a) => a.kilometrageDepuisIntervention !== undefined);
      expect(legacy).toBeDefined();
      expect(legacy.kilometrageDepuisIntervention).toBe(40000);
      expect(legacy.intervalleRecommande).toBe(10000);
    });

    it('should generate KM_SEUIL alert from kilometrageActuel without prior intervention', async () => {
      Camion.find.mockResolvedValue([{ _id: 'camion1', matricule: 'MA-1', kilometrageActuel: 55000 }]);
      Trajet.findOne.mockReturnValue(mockSort(null));
      regleMaintenanceRepository.findAll.mockResolvedValue([
        { typeVehicule: 'CAMION', typeIntervention: 'VIDANGE', intervalleKilometres: 10000 },
      ]);
      interventionMaintenanceRepository.getLastIntervention.mockResolvedValue(null);

      const alertes = await maintenanceService.verifierMaintenancePreventive();

      const kmAlerte = alertes.find((a) => a.type === 'KM_SEUIL');
      expect(kmAlerte).toBeDefined();
      expect(kmAlerte.camion).toBe('MA-1');
      expect(kmAlerte.typeIntervention).toBe('VIDANGE');
      expect(kmAlerte.kmSince).toBe(55000);
      expect(kmAlerte.intervalle).toBe(10000);
      expect(kmAlerte.depassement).toBe(45000);
    });

    it('should compute KM_SEUIL kmSince from last intervention', async () => {
      Camion.find.mockResolvedValue([{ _id: 'camion1', matricule: 'MA-1', kilometrageActuel: 65000 }]);
      Trajet.findOne.mockReturnValue(mockSort(null));
      regleMaintenanceRepository.findAll.mockResolvedValue([
        { typeVehicule: 'CAMION', typeIntervention: 'VIDANGE', intervalleKilometres: 10000 },
      ]);
      interventionMaintenanceRepository.getLastIntervention.mockResolvedValue({
        kilometrageVehicule: 50000,
      });

      const alertes = await maintenanceService.verifierMaintenancePreventive();

      const kmAlerte = alertes.find((a) => a.type === 'KM_SEUIL');
      expect(kmAlerte).toBeDefined();
      expect(kmAlerte.kmSince).toBe(15000);
      expect(kmAlerte.depassement).toBe(5000);
    });

    it('should not generate KM_SEUIL when kmSince below intervalle', async () => {
      Camion.find.mockResolvedValue([{ _id: 'camion1', matricule: 'MA-1', kilometrageActuel: 55000 }]);
      Trajet.findOne.mockReturnValue(mockSort(null));
      regleMaintenanceRepository.findAll.mockResolvedValue([
        { typeVehicule: 'CAMION', typeIntervention: 'VIDANGE', intervalleKilometres: 10000 },
      ]);
      interventionMaintenanceRepository.getLastIntervention.mockResolvedValue({
        kilometrageVehicule: 50000,
      });

      const alertes = await maintenanceService.verifierMaintenancePreventive();

      expect(alertes.filter((a) => a.type === 'KM_SEUIL')).toHaveLength(0);
    });

    it('should skip KM_SEUIL when kilometrageActuel is 0 or rule is not CAMION', async () => {
      Camion.find.mockResolvedValue([
        { _id: 'camion1', matricule: 'MA-1', kilometrageActuel: 0 },
        { _id: 'camion2', matricule: 'MA-2', kilometrageActuel: 80000 },
      ]);
      Trajet.findOne.mockReturnValue(mockSort(null));
      regleMaintenanceRepository.findAll.mockResolvedValue([
        { typeVehicule: 'REMORQUE', typeIntervention: 'FREINS', intervalleKilometres: 5000 },
      ]);
      interventionMaintenanceRepository.getLastIntervention.mockResolvedValue(null);

      const alertes = await maintenanceService.verifierMaintenancePreventive();

      expect(alertes.filter((a) => a.type === 'KM_SEUIL')).toHaveLength(0);
    });
  });
});
