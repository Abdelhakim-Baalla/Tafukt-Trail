const pleinCarburantRepository = require('../repositories/PleinCarburantRepository');
const PleinCarburant = require('../models/PleinCarburant');
const Trajet = require('../models/Trajet');
const Camion = require('../models/Camion');

class PleinCarburantService {
    async createPlein(data) {
        const camion = await Camion.findById(data.camion);
        if (!camion) {
            throw new Error('Camion non trouvé');
        }

        if(!camion.reservoire){
            camion.reservoire = data.quantiteLitre;
            await camion.save();
            return await pleinCarburantRepository.create(data);
        }
                
        camion.reservoire = camion.reservoire + data.quantiteLitre;
        await camion.save();
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
        const oldPlein = await PleinCarburant.findById(id);
        if (!oldPlein) {
            throw new Error('Plein non trouvé');
        }
        if (!data.quantiteLitre) {
            throw new Error('Quantité de litre non trouvée');
        }

        const oldQuantiteLitre = oldPlein.quantiteLitre;
        const newQuantiteLitre = data.quantiteLitre;

        const updatedPlein = await pleinCarburantRepository.update(id, data);

        const camion = await Camion.findById(oldPlein.camion);
        if (!camion) {
            throw new Error('Camion non trouvé');
        }

        if (camion.reservoire !== undefined && camion.reservoire !== null) {
            
            const difference = newQuantiteLitre - oldQuantiteLitre;
            
            camion.reservoire += difference;
            await camion.save();
        }
        
        return updatedPlein;
    }

    async deletePlein(id) {
        const plein = await pleinCarburantRepository.delete(id);
        if (!plein) {
            throw new Error('Plein non trouvé');
        }
        return plein;
    }

    async getOptimisationCouts() {
        const pleins = await PleinCarburant.find().populate('camion').sort({ date: -1 });
        const trajets = await Trajet.find({ statut: 'TERMINE' }).populate('camion');
        
        // Analyse des prix par station
        const stationsAnalyse = {};
        pleins.forEach(p => {
            if (!stationsAnalyse[p.nomStation]) {
                stationsAnalyse[p.nomStation] = { prix: [], total: 0, count: 0 };
            }
            stationsAnalyse[p.nomStation].prix.push(p.prixLitre);
            stationsAnalyse[p.nomStation].total += p.prixLitre;
            stationsAnalyse[p.nomStation].count++;
        });
        
        const stationsOptimales = Object.entries(stationsAnalyse)
            .map(([nom, data]) => ({
                nom,
                prixMoyen: data.total / data.count,
                nombrePleins: data.count
            }))
            .sort((a, b) => a.prixMoyen - b.prixMoyen);
        
        // Consommation excessive par camion
        const camionsConsommation = {};
        trajets.forEach(t => {
            const camionId = t.camion._id.toString();
            if (!camionsConsommation[camionId]) {
                camionsConsommation[camionId] = {
                    camion: t.camion,
                    totalKm: 0,
                    totalCarburant: 0
                };
            }
            if (t.kilometrageArrivee && t.kilometrageDepart) {
                camionsConsommation[camionId].totalKm += (t.kilometrageArrivee - t.kilometrageDepart);
            }
            if (t.carburantNiveauxDepart && t.carburantNiveauxArrivee) {
                camionsConsommation[camionId].totalCarburant += (t.carburantNiveauxDepart - t.carburantNiveauxArrivee);
            }
        });
        
        const camionsAlerte = Object.values(camionsConsommation)
            .map(c => ({
                ...c,
                consommation: c.totalKm > 0 ? (c.totalCarburant / c.totalKm) * 100 : 0
            }))
            .filter(c => c.consommation > 35) // Seuil d'alerte
            .sort((a, b) => b.consommation - a.consommation);
        
        return {
            stationsOptimales,
            camionsAlerte,
            economiesPotentielles: this.calculerEconomies(pleins, stationsOptimales)
        };
    }
    
    calculerEconomies(pleins, stations) {
        if (stations.length < 2) return 0;
        
        const stationMoinsChere = stations[0];
        const prixMoyenActuel = pleins.reduce((sum, p) => sum + p.prixLitre, 0) / pleins.length;
        const litresTotal = pleins.reduce((sum, p) => sum + p.quantiteLitre, 0);
        
        return Math.round((prixMoyenActuel - stationMoinsChere.prixMoyen) * litresTotal * 100) / 100;
    }

    async getRapports() {
        const pleins = await PleinCarburant.find().populate('camion', 'matricule marque model reservoire');
        const trajets = await Trajet.find({ statut: 'TERMINE' }).populate('camion', 'matricule reservoire');
        
        const totalLitres = pleins.reduce((sum, p) => sum + p.quantiteLitre, 0);
        const totalMontant = pleins.reduce((sum, p) => sum + p.montantTotal, 0);
        const nombrePleins = pleins.length;

        let totalKilometrage = 0;
        let totalCarburantConsomme = 0;

        trajets.forEach(t => {
            if (t.kilometrageArrivee && t.kilometrageDepart) {
                totalKilometrage += (t.kilometrageArrivee - t.kilometrageDepart);
            }
            if (t.carburantNiveauxDepart && t.carburantNiveauxArrivee) {
                totalCarburantConsomme += (t.carburantNiveauxDepart - t.carburantNiveauxArrivee);
            }
        });

        const consommationMoyenne = totalKilometrage > 0 
            ? Math.round((totalCarburantConsomme / totalKilometrage) * 100 * 100) / 100 
            : 0;

        const parCamion = {};
        
        pleins.forEach(p => {
            const camionId = p.camion?._id?.toString() || 'inconnu';
            if (!parCamion[camionId]) {
                parCamion[camionId] = {
                    camion: p.camion,
                    totalLitres: 0,
                    totalMontant: 0,
                    nombrePleins: 0,
                    kilometrage: 0,
                    carburantConsomme: 0
                };
            }
            parCamion[camionId].totalLitres += p.quantiteLitre;
            parCamion[camionId].totalMontant += p.montantTotal;
            parCamion[camionId].nombrePleins += 1;
        });

        trajets.forEach(t => {
            const camionId = t.camion?._id?.toString() || 'inconnu';
            if (parCamion[camionId]) {
                if (t.kilometrageArrivee && t.kilometrageDepart) {
                    parCamion[camionId].kilometrage += (t.kilometrageArrivee - t.kilometrageDepart);
                }
                if (t.carburantNiveauxDepart && t.carburantNiveauxArrivee) {
                    parCamion[camionId].carburantConsomme += (t.carburantNiveauxDepart - t.carburantNiveauxArrivee);
                }
            }
        });

        Object.values(parCamion).forEach(c => {
            c.consommationMoyenne = c.kilometrage > 0 
                ? Math.round((c.carburantConsomme / c.kilometrage) * 100 * 100) / 100 
                : 0;
        });

        return {
            global: {
                totalLitres,
                totalMontant,
                nombrePleins,
                totalKilometrage,
                totalCarburantConsomme,
                consommationMoyenne
            },
            parCamion: Object.values(parCamion)
        };
    }
}

module.exports = new PleinCarburantService();
