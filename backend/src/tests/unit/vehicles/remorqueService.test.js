const remorqueService = require('../../../services/remorqueService');
const remorqueRepository = require('../../../repositories/RemorqueRepository');

jest.mock('../../../repositories/RemorqueRepository');

describe('RemorqueService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRemorque', () => {
    it('should create remorque', async () => {
      const data = { matricule: 'REM-001', type: 'PLATEAU', capaciteTonnes: 20 };
      const mockRemorque = { _id: '1', ...data };

      remorqueRepository.create.mockResolvedValue(mockRemorque);

      const result = await remorqueService.createRemorque(data);

      expect(result).toEqual(mockRemorque);
      expect(remorqueRepository.create).toHaveBeenCalledWith(data);
    });
  });

  describe('getAllRemorques', () => {
    it('should get all remorques', async () => {
      const mockRemorques = [
        { _id: '1', matricule: 'REM-001' },
        { _id: '2', matricule: 'REM-002' },
      ];

      remorqueRepository.findAll.mockResolvedValue(mockRemorques);

      const result = await remorqueService.getAllRemorques();

      expect(result).toEqual(mockRemorques);
      expect(result.length).toBe(2);
    });
  });

  describe('getRemorqueById', () => {
    it('should get remorque by id', async () => {
      const mockRemorque = { _id: '1', matricule: 'REM-001' };

      remorqueRepository.findById.mockResolvedValue(mockRemorque);

      const result = await remorqueService.getRemorqueById('1');

      expect(result).toEqual(mockRemorque);
    });

    it('should throw if not found', async () => {
      remorqueRepository.findById.mockResolvedValue(null);

      await expect(remorqueService.getRemorqueById('999'))
        .rejects.toThrow('Remorque non trouvée');
    });
  });

  describe('updateRemorque', () => {
    it('should update remorque', async () => {
      const mockRemorque = { _id: '1', matricule: 'REM-001', capaciteTonnes: 25 };

      remorqueRepository.update.mockResolvedValue(mockRemorque);

      const result = await remorqueService.updateRemorque('1', { capaciteTonnes: 25 });

      expect(result).toEqual(mockRemorque);
    });

    it('should throw if not found', async () => {
      remorqueRepository.update.mockResolvedValue(null);

      await expect(remorqueService.updateRemorque('999', {}))
        .rejects.toThrow('Remorque non trouvée');
    });
  });

  describe('deleteRemorque', () => {
    it('should delete remorque', async () => {
      const mockRemorque = { _id: '1', matricule: 'REM-001' };

      remorqueRepository.delete.mockResolvedValue(mockRemorque);

      const result = await remorqueService.deleteRemorque('1');

      expect(result).toEqual(mockRemorque);
    });

    it('should throw if not found', async () => {
      remorqueRepository.delete.mockResolvedValue(null);

      await expect(remorqueService.deleteRemorque('999'))
        .rejects.toThrow('Remorque non trouvée');
    });
  });
});
