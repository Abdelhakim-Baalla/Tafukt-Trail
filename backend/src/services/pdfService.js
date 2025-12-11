const PDFDocument = require('pdfkit');

class PdfService {
    generateOrdreMission(trajet, res) {
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ordre_mission_${trajet._id}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).font('Helvetica-Bold').text('TAFUKT - ORDRE DE MISSION', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text(`${trajet.lieuDepart} -> ${trajet.lieuArrivee}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
        doc.moveDown(2);

        doc.fontSize(14).font('Helvetica-Bold').text('CHAUFFEUR');
        doc.fontSize(12).font('Helvetica');
        if (trajet.chauffeur) {
            doc.text(`Nom: ${trajet.chauffeur.nom || ''} ${trajet.chauffeur.prenom || ''}`);
            doc.text(`Telephone: ${trajet.chauffeur.telephone || 'N/A'}`);
        }
        doc.moveDown();

        doc.fontSize(14).font('Helvetica-Bold').text('VEHICULE');
        doc.fontSize(12).font('Helvetica');
        if (trajet.camion) {
            doc.text(`Camion: ${trajet.camion.marque || ''} ${trajet.camion.model || ''}`);
            doc.text(`Matricule: ${trajet.camion.matricule || 'N/A'}`);
            doc.text(`Type Carburant: ${trajet.camion.typeCarburant || 'N/A'}`);
            doc.text(`Reservoire: ${trajet.camion.reservoire || 'N/A'}`);
            doc.text(`Date Dernier Controle: ${trajet.camion.dateDernierControle || ' '}`);
        }
        doc.moveDown();

        doc.fontSize(14).font('Helvetica-Bold').text('REMORQUE');
        doc.fontSize(12).font('Helvetica');
        if (trajet.remorque) {
            doc.text(`Remorque: ${trajet.remorque.type || ''} | ${trajet.remorque.capaciteTonnes || ''} Tonnes`);
            doc.text(`Matricule: ${trajet.remorque.matricule || 'N/A'}`);
        }
        doc.moveDown();

        doc.fontSize(14).font('Helvetica-Bold').text('TRAJET');
        doc.fontSize(12).font('Helvetica');
        doc.text(`Depart: ${trajet.lieuDepart}`);
        doc.text(`Arrivee: ${trajet.lieuArrivee}`);
        doc.text(`Date depart: ${new Date(trajet.dateHeureDepart).toLocaleString('fr-FR')}`);
        doc.text(`Kilometrage: ${trajet.kilometrageDepart} km`);
        doc.text(`Statut: ${trajet.statut}`);
        doc.text(`carburant Niveaux Depart: ${trajet.carburantNiveauxDepart}`);
        doc.text(`carburant Niveaux Arrivee: ${trajet.carburantNiveauxArrivee}`);
        doc.text(`Commentaires Chauffeur: ${trajet.commentairesChauffeur}`);
        doc.text(`PDF: ${trajet.urlPDF}`);
        doc.moveDown(2);

        doc.text('Signature du chauffeur: _________________________');

        doc.end();
    }
}

module.exports = new PdfService();

