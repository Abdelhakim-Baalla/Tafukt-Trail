const PDFDocument = require('pdfkit');

class PdfService {
    generateOrdreMission(trajet, res) {
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ordre_mission_${trajet._id}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).font('Helvetica-Bold').text('TAFUKT - ORDRE DE MISSION', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text(`${trajet.lieuDepart || ''} -> ${trajet.lieuArrivee || ''}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
        doc.moveDown(2);

        doc.fontSize(14).font('Helvetica-Bold').text('CHAUFFEUR');
        doc.fontSize(12).font('Helvetica');
        if (trajet.chauffeur) {
            if (trajet.chauffeur.nom || trajet.chauffeur.prenom) doc.text(`Nom: ${trajet.chauffeur.nom || ''} ${trajet.chauffeur.prenom || ''}`);
            if (trajet.chauffeur.telephone) doc.text(`Telephone: ${trajet.chauffeur.telephone}`);
        }
        doc.moveDown();

        doc.fontSize(14).font('Helvetica-Bold').text('VEHICULE');
        doc.fontSize(12).font('Helvetica');
        if (trajet.camion) {
            if (trajet.camion.marque || trajet.camion.model) doc.text(`Camion: ${trajet.camion.marque || ''} ${trajet.camion.model || ''}`);
            if (trajet.camion.matricule) doc.text(`Matricule: ${trajet.camion.matricule}`);
            if (trajet.camion.typeCarburant) doc.text(`Type Carburant: ${trajet.camion.typeCarburant}`);
            if (trajet.camion.reservoire) doc.text(`Reservoire: ${trajet.camion.reservoire}`);
            if (trajet.camion.dateDernierControle) doc.text(`Date Dernier Controle: ${new Date(trajet.camion.dateDernierControle).toLocaleDateString('fr-FR')}`);
        }
        doc.moveDown();

        if (trajet.remorque) {
            doc.fontSize(14).font('Helvetica-Bold').text('REMORQUE');
            doc.fontSize(12).font('Helvetica');
            if (trajet.remorque.type || trajet.remorque.capaciteTonnes) doc.text(`Remorque: ${trajet.remorque.type || ''} | ${trajet.remorque.capaciteTonnes || ''} Tonnes`);
            if (trajet.remorque.matricule) doc.text(`Matricule: ${trajet.remorque.matricule}`);
            doc.moveDown();
        }

        doc.fontSize(14).font('Helvetica-Bold').text('TRAJET');
        doc.fontSize(12).font('Helvetica');
        if (trajet.lieuDepart) doc.text(`Depart: ${trajet.lieuDepart}`);
        if (trajet.lieuArrivee) doc.text(`Arrivee: ${trajet.lieuArrivee}`);
        if (trajet.dateHeureDepart) doc.text(`Date depart: ${new Date(trajet.dateHeureDepart).toLocaleString('fr-FR')}`);
        if (trajet.kilometrageDepart) doc.text(`Kilometrage: ${trajet.kilometrageDepart} km`);
        if (trajet.statut) doc.text(`Statut: ${trajet.statut}`);
        if (trajet.carburantNiveauxDepart) doc.text(`Carburant Niveaux Depart: ${trajet.carburantNiveauxDepart}`);
        if (trajet.carburantNiveauxArrivee) doc.text(`Carburant Niveaux Arrivee: ${trajet.carburantNiveauxArrivee}`);
        if (trajet.commentairesChauffeur) doc.text(`Commentaires Chauffeur: ${trajet.commentairesChauffeur}`);
        if (trajet.urlPDF) {
            doc.text('PDF: ', { continued: true });
            doc.fillColor('blue').text("Download PDF", { link: trajet.urlPDF, underline: true });
            doc.fillColor('black');
        }
        doc.moveDown(2);

        doc.text('Signature du chauffeur: _________________________');

        doc.end();
    }
}

module.exports = new PdfService();
