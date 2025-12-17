# Guide utilisateur

1. But de l'application

- Gérer les véhicules, interventions, trajets, pneus et pleins de carburant.

2. Accès

- L'application a une partie backend (API) et une partie frontend (interface). Selon l'implémentation, vous devez vous authentifier pour accéder aux routes protégées.

3. Exemple d'utilisation rapide (API)

- Se connecter : POST `/auth/login` avec `email` et `password` (vérifier `src/controllers/authController.js`).
- Créer un camion : POST `/camions` avec les champs requis (voir `src/models/Camion.js`).
- Lister les trajets : GET `/trajets`.

4. Frontend

- Ouvrir l'interface (en dev) : `npm run dev` dans `frontend` puis aller sur `http://localhost:3000` ou le port affiché.

5. Troubleshooting rapide

- Erreur de variable d'environnement : vérifier le fichier `.env` et ` .env.example`.
- Tests qui échouent : exécuter `npm test` dans le dossier correspondant pour voir les erreurs.

---

Détails pratiques pour un utilisateur / évaluateur

- Authentification : après `POST /auth/login`, inclure l'en-tête `Authorization: Bearer <token>` pour les routes protégées.
- Exemple `curl` pour créer un camion :

```bash
curl -X POST http://localhost:3000/camions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN>" \
	-d '{"immatriculation":"123-ABC","marque":"Renault","modele":"T520","poids":12000}'
```

- Exemple `curl` pour lister les trajets (public) :

```bash
curl http://localhost:3000/trajets
```

Front-end : navigation rapide

- Page principale : affichage des listes (camions, trajets, remorques).
- Formulaires : utilisez les formulaires existants pour créer ou éditer des entités; les validations sont appliquées côté backend et parfois côté frontend.

Où regarder dans le code pour comprendre rapidement

- Routes : `backend/src/routes/` — définition des endpoints.
- Contrôleurs : `backend/src/controllers/` — logique exposée pour chaque route.
- Services : `backend/src/services/` — règles métier.
- Modèles : `backend/src/models/` — structure des données.
