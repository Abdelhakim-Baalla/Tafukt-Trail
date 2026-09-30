import { useState } from 'react';
import { Link } from 'react-router-dom';

const QuoteForm = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    origin: '',
    destination: '',
    method: '',
    weight: '',
    date: '',
    notes: '',
    consent: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="ld-quote tt-section" id="contact">
      <div className="tt-container ld-quote__grid">
        <div className="ld-quote__form-wrap">
          <span className="eyebrow eyebrow--accent">Demander un accès</span>
          <h2>Parlez-nous de votre flotte</h2>
          <p className="ld-quote__lead">
            Envoyez l&apos;essentiel : un spécialiste revient vers vous avec un parcours
            adapté (admin + chauffeurs) sous un jour ouvré.
          </p>

          {sent ? (
            <div className="ld-quote__success" role="status">
              <h3>Demande envoyée</h3>
              <p>
                Merci. Créez déjà votre compte pour explorer Tafukt Trail, ou attendez
                notre retour.
              </p>
              <Link to="/register" className="btn btn--dark">
                Créer un compte
              </Link>
            </div>
          ) : (
            <form className="ld-quote__form" onSubmit={onSubmit}>
              <fieldset>
                <legend>Coordonnées</legend>
                <div className="ld-quote__row">
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="name">Nom complet</label>
                    <input id="name" name="name" className="tt-input" value={form.name} onChange={onChange} required />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="company">Entreprise</label>
                    <input id="company" name="company" className="tt-input" value={form.company} onChange={onChange} required />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="email">Email pro</label>
                    <input id="email" name="email" type="email" className="tt-input" placeholder="vous@entreprise.ma" value={form.email} onChange={onChange} required />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="phone">Téléphone</label>
                    <input id="phone" name="phone" className="tt-input" value={form.phone} onChange={onChange} />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Votre activité</legend>
                <div className="ld-quote__row">
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="origin">Région / dépôt</label>
                    <input id="origin" name="origin" className="tt-input" value={form.origin} onChange={onChange} />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="destination">Corridors principaux</label>
                    <input id="destination" name="destination" className="tt-input" value={form.destination} onChange={onChange} />
                  </div>
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="method">Taille de flotte</label>
                    <select id="method" name="method" className="tt-select" value={form.method} onChange={onChange}>
                      <option value="">Sélectionner</option>
                      <option value="1-5">1–5 véhicules</option>
                      <option value="6-20">6–20 véhicules</option>
                      <option value="21-50">21–50 véhicules</option>
                      <option value="50+">50+ véhicules</option>
                    </select>
                  </div>
                  <div className="tt-field">
                    <label className="tt-label" htmlFor="weight">Chauffeurs</label>
                    <input id="weight" name="weight" className="tt-input" placeholder="Nombre approximatif" value={form.weight} onChange={onChange} />
                  </div>
                </div>
                <div className="tt-field" style={{ marginTop: 16 }}>
                  <label className="tt-label" htmlFor="date">Date souhaitée de démarrage</label>
                  <input id="date" name="date" type="date" className="tt-input" value={form.date} onChange={onChange} />
                </div>
              </fieldset>

              <fieldset>
                <legend>Précisions</legend>
                <div className="tt-field">
                  <label className="tt-label" htmlFor="notes">Parlez-nous de vos besoins</label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="tt-textarea"
                    placeholder="Modules prioritaires, contraintes, intégrations…"
                    value={form.notes}
                    onChange={onChange}
                  />
                </div>
              </fieldset>

              <label className="ld-quote__consent">
                <input type="checkbox" name="consent" checked={form.consent} onChange={onChange} required />
                <span>En envoyant ce formulaire, vous acceptez d&apos;être contacté par notre équipe.</span>
              </label>

              <button type="submit" className="btn btn--dark btn--block">
                Envoyer ma demande
              </button>
            </form>
          )}
        </div>

        <div className="ld-quote__media">
          <img src="/Homme-Debout-Devant-Un-Camion.jpg" alt="Camion Tafukt Trail" />
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
