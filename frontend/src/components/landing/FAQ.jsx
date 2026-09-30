import { useState } from 'react';
import { Link } from 'react-router-dom';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const faqs = [
  {
    q: 'Quels modules propose Tafukt Trail ?',
    a: 'Flotte (camions, remorques, pneus), trajets et ordres de mission, carburant, maintenance et rapports PDF.',
  },
  {
    q: 'Y a-t-il un espace chauffeur ?',
    a: 'Oui. Les chauffeurs accèdent à leurs trajets et peuvent saisir le carburant depuis un espace dédié.',
  },
  {
    q: 'Comment démarrer ?',
    a: 'Créez un compte, invitez votre équipe, ajoutez vos véhicules puis planifiez le premier trajet.',
  },
  {
    q: 'Puis-je exporter des documents ?',
    a: 'Oui. Les ordres de mission et plusieurs rapports sont disponibles en PDF.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'L’accès est protégé par authentification et rôles (admin / chauffeur). Les données restent isolées par compte.',
  },
  {
    q: 'Proposez-vous un accompagnement ?',
    a: 'Oui. Contactez-nous pour une démo et un paramétrage adapté à votre organisation.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="ld-faq tt-section">
      <div className="tt-container ld-faq__grid">
        <div className="ld-faq__intro">
          <span className="eyebrow eyebrow--accent">FAQ</span>
          <h2>Questions flotte, réponses claires.</h2>
          <p>
            Les réponses aux questions fréquentes sur Tafukt Trail, les rôles, le suivi
            et les exports.
          </p>
          <Link to="/register" className="btn-split btn-split--dark">
            <span className="btn-split-label">Poser une question</span>
            <span className="btn-split-arrow"><ArrowIcon /></span>
          </Link>
        </div>

        <div className="ld-faq__list">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`ld-faq__item ${isOpen ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="ld-faq__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="ld-faq__answer">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
