const camionRepository = require('../repositories/CamionRepository');

class CamionService {
    async createCamion(data) {
        return await camionRepository.create(data);
    }

    async getAllCamions() {
        return await camionRepository.findAll();
    }

    async getCamionByStatut(statut) {
        return await camionRepository.findByStatut(statut);
    }

    async getCamionById(id) {
        const camion = await camionRepository.findById(id);
        if (!camion) {
            throw new Error('Camion non trouvé');
        }
        return camion;
    }

    async updateCamion(id, data) {
        const camion = await camionRepository.update(id, data);
        if (!camion) {
            throw new Error('Camion non trouvé');
        }
        return camion;
    }

    async deleteCamion(id) {
        const camion = await camionRepository.delete(id);
        if (!camion) {
            throw new Error('Camion non trouvé');
        }
        return camion;
    }
}

module.exports = new CamionService();
