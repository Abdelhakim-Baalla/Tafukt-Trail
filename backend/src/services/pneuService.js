const pneuRepository = require('../repositories/PneuRepository');
const Camion = require('../models/Camion');
const PositionPneu = require('../enums/tirePositions');

class PneuService {
    async createPneu(data) {
        const allPneus = await pneuRepository.findAll();
        const pneu = await pneuRepository.findByPosition(data.position);
        for (let i = 0; i < pneu.length; i++) {
            if (pneu[i].position === data.position && pneu[i].camion._id.toString() === data.camion) {
                let camion = await Camion.findById(pneu[i].camion._id);
                throw new Error('Pneu deja existant dans cette position: ' + data.position + ' pour le camion: ' + camion.matricule + ' ' + camion.marque + ' ' + camion.model);
            }
        }

        const camion = await Camion.findById(data.camion);
        if (!camion) {
            throw new Error('Camion non trouvé');
        }

        let count = 0;
        for (let i = 0; i < allPneus.length; i++) {
            if (allPneus[i].camion._id.toString() === data.camion && allPneus[i].position !== PositionPneu.ROULE_DE_SECOURS) {
                count++;
            }
            if(count >= 4){
                throw new Error('Camion deja contient 4 pneus');
            }
        }
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
        const pneu = await pneuRepository.findById(id);
        if (!pneu) {
            throw new Error('Pneu non trouvé');
        }

        if (data.position && data.position !== pneu.position) {
            const existingPneu = await pneuRepository.findByPosition(data.position);
            for (let i = 0; i < existingPneu.length; i++) {
                if (existingPneu[i].position === data.position && existingPneu[i].camion._id.toString() !== data.camion) {
                    let camion = await Camion.findById(existingPneu[i].camion._id);
                    throw new Error('Pneu deja existant dans cette position: ' + data.position + ' pour le camion: ' + camion.matricule + ' ' + camion.marque + ' ' + camion.model);
                }
            }
           
        }

        if (data.camion && data.camion !== pneu.camion.toString()) {
            const camion = await Camion.findById(data.camion);
            if (!camion) {
                throw new Error('Camion non trouvé');
            }

            const allPneus = await pneuRepository.findAll();
            let count = 0;
            for (let i = 0; i < allPneus.length; i++) {
                if (allPneus[i].camion._id.toString() === data.camion && allPneus[i]._id.toString() !== id) {
                    count++;
                }
                if (count >= 4) {
                    throw new Error('Camion deja contient 4 pneus');
                }
            }
        }

        return await pneuRepository.update(id, data);
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
