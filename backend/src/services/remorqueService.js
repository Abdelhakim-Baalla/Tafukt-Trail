const remorqueRepository = require('../repositories/RemorqueRepository');

class RemorqueService {
    async createRemorque(data) {
        return await remorqueRepository.create(data);
    }

    async getAllRemorques() {
        return await remorqueRepository.findAll();
    }

    async getRemorqueByStatut(statut) {
        return await remorqueRepository.findByStatut(statut);
    }

    async getRemorqueById(id) {
        const remorque = await remorqueRepository.findById(id);
        if (!remorque) {
            throw new Error('Remorque non trouvée');
        }
        return remorque;
    }

    async updateRemorque(id, data) {
        const remorque = await remorqueRepository.update(id, data);
        if (!remorque) {
            throw new Error('Remorque non trouvée');
        }
        return remorque;
    }

    async deleteRemorque(id) {
        const remorque = await remorqueRepository.delete(id);
        if (!remorque) {
            throw new Error('Remorque non trouvée');
        }
        return remorque;
    }
}

module.exports = new RemorqueService();
