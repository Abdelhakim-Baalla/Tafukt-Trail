const pneuRepository = require('../repositories/PneuRepository');

class PneuService {
    async createPneu(data) {
        return await pneuRepository.create(data);
    }

    async getAllPneus() {
        return await pneuRepository.findAll();
    }

    async getPneuByPosition(position) {
        return await pneuRepository.findByPosition(position);
    }

    async getPneuById(id) {
        const pneu = await pneuRepository.findById(id);
        if (!pneu) {
            throw new Error('Pneu non trouvé');
        }
        return pneu;
    }

    async updatePneu(id, data) {
        const pneu = await pneuRepository.update(id, data);
        if (!pneu) {
            throw new Error('Pneu non trouvé');
        }
        return pneu;
    }

    async deletePneu(id) {
        const pneu = await pneuRepository.delete(id);
        if (!pneu) {
            throw new Error('Pneu non trouvé');
        }
        return pneu;
    }
}

module.exports = new PneuService();
