const TrajetService = require('../services/trajetService');
const trajetRepository = require('../repositories/TrajetRepository');
const Camion = require('../models/Camion');
const Utilisateur = require('../models/Utilisateur');
const Remorque = require('../models/Remorque');

jest.mock('../repositories/TrajetRepository');
jest.mock('../models/Camion');
jest.mock('../models/Utilisateur');
jest.mock('../models/Remorque');

describe('TrajetService', () => {
    describe('updateStatut', () => {
        const mockUser = { role: 'CHAUFFEUR', id: 'user123' };
        const mockTrajetId = 'trajet123';
        const mockTrajet = {
            _id: mockTrajetId,
            chauffeur: { _id: 'user123' },
            camion: { _id: 'camion123' },
            remorque: null,
            dateHeureDepart: new Date('2025-01-01'),
            kilometrageDepart: 1000
        };

        beforeEach(() => {
            jest.clearAllMocks();
            trajetRepository.findById.mockResolvedValue(mockTrajet);
            trajetRepository.update.mockResolvedValue({ ...mockTrajet, statut: 'EN_COURS' });
            Camion.findById.mockResolvedValue({ _id: 'camion123', save: jest.fn() });
            Utilisateur.findByIdAndUpdate.mockResolvedValue({});
            Camion.findByIdAndUpdate.mockResolvedValue({});
        });

        it('should allow starting a trip (EN_COURS) without finish data', async () => {
            const data = { statut: 'EN_COURS' };

            await TrajetService.updateStatut(mockTrajetId, data, mockUser);

            // Verify update called
            expect(trajetRepository.update).toHaveBeenCalledWith(mockTrajetId, expect.objectContaining({ statut: 'EN_COURS' }));
            
            // Verify NO finish logic triggered (e.g. Camion lookup for fuel)
            // In the code, Camion.findById is only called if statut === TERMINE
            expect(Camion.findById).not.toHaveBeenCalled();
        });

        it('should throw error if finishing trip (TERMINE) without fuel level', async () => {
            const data = { statut: 'TERMINE' }; // Missing carburantNiveauxArrivee

            await expect(TrajetService.updateStatut(mockTrajetId, data, mockUser))
                .rejects.toThrow('Niveau de carburant arrivee non fourni!');
        });

        it('should successfully finish trip (TERMINE) with valid data', async () => {
            const data = {
                statut: 'TERMINE',
                carburantNiveauxArrivee: 50,
                dateHeureArrivee: new Date('2025-01-02'),
                kilometrageArrivee: 1200,
                commentairesChauffeur: 'Ras'
            };
            
            const mockCamion = { _id: 'camion123', reservoire: 100, save: jest.fn() };
            Camion.findById.mockResolvedValue(mockCamion);

            await TrajetService.updateStatut(mockTrajetId, data, mockUser);

            // Verify update
            expect(trajetRepository.update).toHaveBeenCalled();
            // Verify camion fuel updated
            expect(mockCamion.reservoire).toBe(50);
            expect(mockCamion.save).toHaveBeenCalled();
            // Verify resources freed
            expect(Camion.findByIdAndUpdate).toHaveBeenCalledWith('camion123', expect.objectContaining({ statut: 'DISPONIBLE' }));
        });
    });
});
