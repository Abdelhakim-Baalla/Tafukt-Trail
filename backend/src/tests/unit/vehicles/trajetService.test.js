jest.mock('../../../repositories/TrajetRepository');
jest.mock('../../../repositories/CamionRepository');
jest.mock('../../../models/Camion', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock('../../../models/Remorque', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock('../../../models/Utilisateur', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const trajetService = require('../../../services/trajetService');
const trajetRepository = require('../../../repositories/TrajetRepository');
const camionRepository = require('../../../repositories/CamionRepository');
const Camion = require('../../../models/Camion');
const Remorque = require('../../../models/Remorque');
const Utilisateur = require('../../../models/Utilisateur');

describe('TrajetService - Unit Tests', () => {
  const admin = { id: 'admin1', role: 'ADMIN' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTrajet', () => {
    it('should create trajet and set camion/remorque/chauffeur EN_MISSION', async () => {
      const data = {
        camion: 'camion1',
        remorque: 'remorque1',
        chauffeur: 'chauffeur1',
        kilometrageDepart: 1000,
        carburantNiveauxDepart: 200,
      };
      const mockTrajet = { _id: '1', ...data, statut: 'PLANIFIE' };

      Camion.findById.mockResolvedValue({ _id: 'camion1', statut: 'DISPONIBLE', reservoire: 200 });
      Remorque.findById.mockResolvedValue({ _id: 'remorque1', statut: 'DISPONIBLE' });
      Utilisateur.findById.mockResolvedValue({ _id: 'chauffeur1', statut: 'DISPONIBLE' });
      trajetRepository.create.mockResolvedValue(mockTrajet);
      Camion.findByIdAndUpdate.mockResolvedValue({});
      Remorque.findByIdAndUpdate.mockResolvedValue({});
      Utilisateur.findByIdAndUpdate.mockResolvedValue({});

      const result = await trajetService.createTrajet(data);

      expect(result).toEqual(mockTrajet);
      expect(trajetRepository.create).toHaveBeenCalledWith(data);
      expect(Camion.findByIdAndUpdate).toHaveBeenCalledWith('camion1', { statut: 'EN_MISSION' });
      expect(Remorque.findByIdAndUpdate).toHaveBeenCalledWith('remorque1', { statut: 'EN_MISSION' });
      expect(Utilisateur.findByIdAndUpdate).toHaveBeenCalledWith('chauffeur1', { statut: 'EN_MISSION' });
    });
  });

  describe('updateStatut', () => {
    it('should reject illegal transition PLANIFIE -> TERMINE', async () => {
      trajetRepository.findById.mockResolvedValue({
        _id: '1',
        chauffeur: 'chauffeur1',
        camion: 'camion1',
        statut: 'PLANIFIE',
        kilometrageDepart: 1000,
        dateHeureDepart: new Date('2026-01-01'),
      });

      await expect(
        trajetService.updateStatut('1', { statut: 'TERMINE', kilometrageArrivee: 1500 }, admin)
      ).rejects.toThrow('Transition de statut invalide');
    });

    it('should reject chauffeur touching another chauffeur trajet with 403', async () => {
      trajetRepository.findById.mockResolvedValue({
        _id: '1',
        chauffeur: 'owner1',
        camion: 'camion1',
        statut: 'EN_COURS',
        kilometrageDepart: 1000,
        dateHeureDepart: new Date('2026-01-01'),
      });
      const other = { id: 'other1', role: 'CHAUFFEUR' };

      await expect(
        trajetService.updateStatut('1', { statut: 'TERMINE' }, other)
      ).rejects.toThrow('Accès non autorisé');
    });

    it('should require kilometrage/carburant/date for TERMINE', async () => {
      const base = {
        _id: '1',
        chauffeur: 'chauffeur1',
        camion: 'camion1',
        statut: 'EN_COURS',
        kilometrageDepart: 1000,
        dateHeureDepart: new Date('2026-01-01T08:00:00Z'),
      };
      trajetRepository.findById.mockResolvedValue({ ...base });

      await expect(
        trajetService.updateStatut('1', {
          statut: 'TERMINE',
          carburantNiveauxArrivee: 150,
          dateHeureArrivee: new Date('2026-01-02T08:00:00Z'),
        }, admin)
      ).rejects.toThrow('Kilometrage arrivee non fourni!');

      await expect(
        trajetService.updateStatut('1', {
          statut: 'TERMINE',
          kilometrageArrivee: 1500,
          dateHeureArrivee: new Date('2026-01-02T08:00:00Z'),
        }, admin)
      ).rejects.toThrow('Niveau de carburant arrivee non fourni!');

      await expect(
        trajetService.updateStatut('1', {
          statut: 'TERMINE',
          kilometrageArrivee: 1500,
          carburantNiveauxArrivee: 150,
        }, admin)
      ).rejects.toThrow('Date et heure arrivee non fourni!');
    });

    it('should update kilometrageActuel to max on TERMINE via CamionRepository', async () => {
      trajetRepository.findById.mockResolvedValue({
        _id: '1',
        chauffeur: 'chauffeur1',
        camion: 'camion1',
        statut: 'EN_COURS',
        kilometrageDepart: 1000,
        dateHeureDepart: new Date('2026-01-01T08:00:00Z'),
      });
      const updated = { _id: '1', statut: 'TERMINE' };
      trajetRepository.update.mockResolvedValue(updated);
      Camion.findByIdAndUpdate.mockResolvedValue({});
      Remorque.findByIdAndUpdate.mockResolvedValue({});
      Utilisateur.findByIdAndUpdate.mockResolvedValue({});
      camionRepository.findById.mockResolvedValue({ _id: 'camion1', reservoire: 200, kilometrageActuel: 1200 });
      camionRepository.update.mockResolvedValue({});

      const result = await trajetService.updateStatut('1', {
        statut: 'TERMINE',
        kilometrageArrivee: 1500,
        carburantNiveauxArrivee: 150,
        dateHeureArrivee: new Date('2026-01-02T08:00:00Z'),
      }, admin);

      expect(result).toEqual(updated);
      expect(camionRepository.update).toHaveBeenCalledWith('camion1', {
        kilometrageActuel: 1500,
      });
    });

    it('should never decrease kilometrageActuel on TERMINE', async () => {
      trajetRepository.findById.mockResolvedValue({
        _id: '1',
        chauffeur: 'chauffeur1',
        camion: 'camion1',
        statut: 'EN_COURS',
        kilometrageDepart: 1000,
        dateHeureDepart: new Date('2026-01-01T08:00:00Z'),
      });
      trajetRepository.update.mockResolvedValue({ _id: '1', statut: 'TERMINE' });
      Camion.findByIdAndUpdate.mockResolvedValue({});
      Utilisateur.findByIdAndUpdate.mockResolvedValue({});
      camionRepository.findById.mockResolvedValue({ _id: 'camion1', reservoire: 200, kilometrageActuel: 9000 });
      camionRepository.update.mockResolvedValue({});

      await trajetService.updateStatut('1', {
        statut: 'TERMINE',
        kilometrageArrivee: 1500,
        carburantNiveauxArrivee: 150,
        dateHeureArrivee: new Date('2026-01-02T08:00:00Z'),
      }, admin);

      expect(camionRepository.update).toHaveBeenCalledWith('camion1', {
        kilometrageActuel: 9000,
      });
    });
  });
});
