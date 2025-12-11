const pleinCarburantRepository = require('../repositories/PleinCarburantRepository');
const PleinCarburant = require('../models/PleinCarburant');

class PleinCarburantService {
    async createPlein(data) {
        return await pleinCarburantRepository.create(data);
    }

    async getAllPleins() {
        return await pleinCarburantRepository.findAll();
    }

    async getPleinsByCamion(camionId) {
        return await pleinCarburantRepository.findByCamion(camionId);
    }

    async getPleinById(id) {
        const plein = await pleinCarburantRepository.findById(id);
        if (!plein) {
            throw new Error('Plein non trouvé');
        }
        return plein;
    }

    async updatePlein(id, data) {
        const plein = await pleinCarburantRepository.update(id, data);
        if (!plein) {
            throw new Error('Plein non trouvé');
        }
        return plein;
    }

    async deletePlein(id) {
        const plein = await pleinCarburantRepository.delete(id);
        if (!plein) {
            throw new Error('Plein non trouvé');
        }
        return plein;
    }

    async getRapports() {
        const pleins = await PleinCarburant.find().populate('camion', 'matricule marque model');
        
        const totalLitres = pleins.reduce((sum, p) => sum + p.quantiteLitre, 0);
        const totalMontant = pleins.reduce((sum, p) => sum + p.montantTotal, 0);
        const nombrePleins = pleins.length;
        const prixMoyenLitre = nombrePleins > 0 ? totalMontant / totalLitres : 0;

        const parCamion = {};
        pleins.forEach(p => {
            const camionId = p.camion?._id?.toString() || 'inconnu';
            if (!parCamion[camionId]) {
                parCamion[camionId] = {
                    camion: p.camion,
                    totalLitres: 0,
                    totalMontant: 0,
                    nombrePleins: 0
                };
            }
            parCamion[camionId].totalLitres += p.quantiteLitre;
            parCamion[camionId].totalMontant += p.montantTotal;
            parCamion[camionId].nombrePleins += 1;
        });

        return {
            global: {
                totalLitres,
                totalMontant,
                nombrePleins,
                prixMoyenLitre: Math.round(prixMoyenLitre * 100) / 100
            },
            parCamion: Object.values(parCamion)
        };
    }
}

module.exports = new PleinCarburantService();

