require('dotenv').config();
const mongoose = require('mongoose');
const Utilisateur = require('./models/Utilisateur');
const Camion = require('./models/Camion');
const Trajet = require('./models/Trajet');

const seed = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI manquant dans le fichier .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  try {
    // ---------- Utilisateurs ----------
    const utilisateursASemer = [
      {
        nom: 'Admin',
        prenom: 'Tafukt',
        email: 'admin@tafukt.ma',
        motDePasse: 'Admin123!',
        role: 'ADMIN',
        telephone: '+212600000001',
      },
      {
        nom: 'Bennani',
        prenom: 'Yassine',
        email: 'yassine@tafukt.ma',
        motDePasse: 'Driver123!',
        role: 'CHAUFFEUR',
        telephone: '+212600000002',
      },
    ];

    for (const donnees of utilisateursASemer) {
      const existant = await Utilisateur.findOne({ email: donnees.email });
      if (existant) {
        console.log(`Utilisateur déjà existant, ignoré : ${donnees.email}`);
        continue;
      }
      await Utilisateur.create(donnees);
      console.log(`Utilisateur créé : ${donnees.email} (${donnees.role})`);
    }

    // ---------- Camions ----------
    const camionsASemer = [
      {
        marque: 'Volvo',
        model: 'FH16',
        annee: 2022,
        typeCarburant: 'DIESEL',
        matricule: 'MA-48213',
        reservoire: 500,
        kilometrageActuel: 0,
      },
      {
        marque: 'Mercedes',
        model: 'Actros',
        annee: 2023,
        typeCarburant: 'DIESEL',
        matricule: 'MA-90571',
        reservoire: 500,
        kilometrageActuel: 0,
      },
    ];

    for (const donnees of camionsASemer) {
      const existant = await Camion.findOne({ matricule: donnees.matricule });
      if (existant) {
        console.log(`Camion déjà existant, ignoré : ${donnees.matricule}`);
        continue;
      }
      await Camion.create(donnees);
      console.log(`Camion créé : ${donnees.marque} ${donnees.model} (${donnees.matricule})`);
    }

    // ---------- Trajet Casa -> Agadir ----------
    const chauffeur = await Utilisateur.findOne({ email: 'yassine@tafukt.ma' });
    const camion = await Camion.findOne({ matricule: 'MA-48213' });

    if (chauffeur && camion) {
      const trajetExistant = await Trajet.findOne({
        lieuDepart: 'Casablanca',
        lieuArrivee: 'Agadir',
        chauffeur: chauffeur._id,
        camion: camion._id,
      });
      if (trajetExistant) {
        console.log('Trajet déjà existant, ignoré : Casablanca -> Agadir');
      } else {
        await Trajet.create({
          camion: camion._id,
          chauffeur: chauffeur._id,
          lieuDepart: 'Casablanca',
          lieuArrivee: 'Agadir',
          dateHeureDepart: new Date(Date.now() + 24 * 60 * 60 * 1000),
          statut: 'PLANIFIE',
          kilometrageDepart: camion.kilometrageActuel ?? 0,
          carburantNiveauxDepart: camion.reservoire ?? 0,
        });
        console.log('Trajet créé : Casablanca -> Agadir (PLANIFIE)');
      }
    } else {
      console.log('Trajet non créé : chauffeur ou camion introuvable');
    }

    console.log('----------------------------------------');
    console.log('Données initiales prêtes.');
    console.log('Comptes :');
    console.log('  ADMIN : admin@tafukt.ma / Admin123!');
    console.log('  CHAUFFEUR : yassine@tafukt.ma / Driver123!');
  } finally {
    await mongoose.disconnect();
  }
};

seed().catch(async (erreur) => {
  console.error('Échec du seed :', erreur.message);
  await mongoose.disconnect();
  process.exit(1);
});
