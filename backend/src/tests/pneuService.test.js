const PneuService = require('../services/pneuService');
const pneuRepository = require('../repositories/PneuRepository');
const Camion = require('../models/Camion');
const PositionPneu = require('../enums/tirePositions');

jest.mock('../repositories/PneuRepository');
jest.mock('../models/Camion');

describe('PneuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPneu', () => {
    it('should create a new pneu', async () => {
      const data = { position: 'AVANT_GAUCHE', camion: '123', marque: 'Michelin' };
      const mockPneu = { _id: '456', ...data };

      pneuRepository.findAll.mockResolvedValue([]);
      pneuRepository.findByPosition.mockResolvedValue([]);
      Camion.findById.mockResolvedValue({ _id: '123', matricule: 'ABC123' });
      pneuRepository.create.mockResolvedValue(mockPneu);

      const result = await PneuService.createPneu(data);

      expect(pneuRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockPneu);
    });

    it('should throw error if pneu already exists at position', async () => {
      const data = { position: 'AVANT_GAUCHE', camion: '123' };
      const existingPneu = { position: 'AVANT_GAUCHE', camion: { _id: '123' } };

      pneuRepository.findAll.mockResolvedValue([]);
      pneuRepository.findByPosition.mockResolvedValue([existingPneu]);
      Camion.findById.mockResolvedValue({ _id: '123', matricule: 'ABC123', marque: 'Volvo', model: 'FH16' });

      await expect(PneuService.createPneu(data)).rejects.toThrow(/Pneu deja existant/);
    });

    it('should throw error if camion not found', async () => {
      const data = { position: 'AVANT_GAUCHE', camion: '999' };

      pneuRepository.findAll.mockResolvedValue([]);
      pneuRepository.findByPosition.mockResolvedValue([]);
      Camion.findById.mockResolvedValue(null);

      await expect(PneuService.createPneu(data)).rejects.toThrow('Camion non trouvé');
    });

    it('should throw error if camion already has 4 pneus', async () => {
      const data = { position: 'ROUE_DE_SECOURS', camion: '123' };
      const existingPneus = [
        { camion: { _id: '123' }, position: 'AVANT_GAUCHE' },
        { camion: { _id: '123' }, position: 'AVANT_DROIT' },
        { camion: { _id: '123' }, position: 'ARRIERE_GAUCHE' },
        { camion: { _id: '123' }, position: 'ARRIERE_DROIT' }
      ];

      pneuRepository.findAll.mockResolvedValue(existingPneus);
      pneuRepository.findByPosition.mockResolvedValue([]);
      Camion.findById.mockResolvedValue({ _id: '123' });

      await expect(PneuService.createPneu(data)).rejects.toThrow('Camion deja contient 4 pneus');
    });
  });

  describe('getAllPneus', () => {
    it('should return all pneus', async () => {
      const mockPneus = [
        { _id: '1', position: 'AVANT_GAUCHE', marque: 'Michelin' },
        { _id: '2', position: 'AVANT_DROIT', marque: 'Bridgestone' }
      ];

      pneuRepository.findAll.mockResolvedValue(mockPneus);

      const result = await PneuService.getAllPneus();

      expect(pneuRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPneus);
      expect(result.length).toBe(2);
    });
  });

  describe('getPneuById', () => {
    it('should return a pneu by id', async () => {
      const mockPneu = { _id: '456', position: 'AVANT_GAUCHE', marque: 'Michelin' };

      pneuRepository.findById.mockResolvedValue(mockPneu);

      const result = await PneuService.getPneuById('456');

      expect(pneuRepository.findById).toHaveBeenCalledWith('456');
      expect(result).toEqual(mockPneu);
    });

    it('should throw error if pneu not found', async () => {
      pneuRepository.findById.mockResolvedValue(null);

      await expect(PneuService.getPneuById('999')).rejects.toThrow('Pneu non trouvé');
    });
  });

  describe('updatePneu', () => {
    it('should update a pneu', async () => {
      const id = '456';
      const data = { usure: 50 };
      const mockPneu = { _id: id, position: 'AVANT_GAUCHE', camion: '123', ...data };

      pneuRepository.findById.mockResolvedValue(mockPneu);
      pneuRepository.update.mockResolvedValue(mockPneu);

      const result = await PneuService.updatePneu(id, data);

      expect(pneuRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(mockPneu);
    });

    it('should throw error if pneu not found during update', async () => {
      pneuRepository.findById.mockResolvedValue(null);

      await expect(PneuService.updatePneu('999', {})).rejects.toThrow('Pneu non trouvé');
    });
  });

  describe('deletePneu', () => {
    it('should delete a pneu', async () => {
      const mockPneu = { _id: '456', position: 'AVANT_GAUCHE' };

      pneuRepository.delete.mockResolvedValue(mockPneu);

      const result = await PneuService.deletePneu('456');

      expect(pneuRepository.delete).toHaveBeenCalledWith('456');
      expect(result).toEqual(mockPneu);
    });

    it('should throw error if pneu not found during delete', async () => {
      pneuRepository.delete.mockResolvedValue(null);

      await expect(PneuService.deletePneu('999')).rejects.toThrow('Pneu non trouvé');
    });
  });
});
