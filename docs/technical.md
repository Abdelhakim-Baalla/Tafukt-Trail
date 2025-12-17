# Documentation technique

1. Objectif
   -- Fournir les informations nécessaires pour comprendre, exécuter et développer l'application côté backend et frontend.
2. Prérequis

- Node.js 18+ (20 recommandé pour correspondre au workflow)
- npm 8+ (ou yarn)
- Docker & docker-compose (optionnel pour exécution conteneurisée)
- Git

3. Architecture

- Backend: Node.js + Express. Structure classique: `src/controllers`, `src/services`, `src/repositories`, `src/models`, `src/routes`, `src/middlewares`.
- Frontend: Vite + React app dans `frontend/` (source dans `frontend/src`).
- CI: GitHub Actions (`.github/workflows/ci-cd.yml`) qui installe, teste, build et construit des images Docker, puis exécute des smoke-tests.

4. Installation locale détaillée

Backend (développement)

- Se placer dans `backend/`.
- Installer : `npm ci`.
- Variables d'environnement : copier `backend/.env.example` -> `backend/.env` et remplir `PORT`, `DATABASE_URL`, `JWT_SECRET`.
- Lancer les migrations si présentes (ex: `npm run migrate`, adapter selon ORM) — vérifier `package.json`.
- Lancer les tests unitaires : `npm test`.
- Démarrer en mode dev : `npm run dev` (surveillez `server.js` / `app.js` pour les scripts exacts).

Frontend (développement)

- Se placer dans `frontend/`.
- Installer : `npm ci`.
- Démarrer le serveur de développement : `npm run dev` (notez le port indiqué, typiquement 5173 pour Vite).
- Build production : `npm run build` (génère `dist/`).

5. Endpoints clés (exemples basés sur la structure du projet)

- Authentification:
  - POST `/auth/login` — login with email/password, retourne JWT.
  - POST `/auth/register` (si disponible).
- Camions:
  - GET `/camions` — lister
  - POST `/camions` — créer
  - GET `/camions/:id` — détail
- Trajets:
  - GET `/trajets`
  - POST `/trajets`
- Pneus, Pleins, Remorques, Maintenance : routes similaires sous `/pneus`, `/pleinCarburant`, `/remorques`, `/maintenance`.

Consultez `src/routes/*.js` pour la liste exacte des routes exposées.

6. Modèles et pattern

- Les modèles dans `src/models/` représentent les entités (ex: `Camion`, `Trajet`, `Utilisateur`).
- Les repositories (`src/repositories`) encapsulent l'accès aux données (SQL / ORM / filesystem) — interface pour le service.
- Les services (`src/services`) contiennent la logique métier, appel des repositories et transformations.
- Les controllers (`src/controllers`) traduisent les requêtes HTTP en appels aux services et formatent les réponses.

7. Middleware important

- `src/middlewares/authMiddleware.js` : gère l'authentification via JWT et protège les routes.

8. Docker & Docker Compose

Dockerfiles: vérifiez `backend/Dockerfile` et `frontend/Dockerfile` — ils devraient exposer les instructions `COPY`, `RUN npm ci`, `CMD` ou `ENTRYPOINT`.

Exemple de build local :

```bash
docker build -t tafukt/backend:local ./backend
docker build -t tafukt/frontend:local ./frontend
```

Si vous utilisez `docker-compose.yml` (racine), lancez :

```bash
docker-compose up --build
```

9. CI / GitHub Actions (détails)

- Le fichier `.github/workflows/ci-cd.yml` contient :
  - jobs `backend` et `frontend` pour installer et exécuter tests/builds
  - job `docker-build` pour construire des images
  - job `smoke-test` pour exécuter de simples vérifications sur les images

Secrets et pushes d'images : pour pousser vers un registry, ajoutez des secrets dans GitHub (`DOCKER_USERNAME`, `DOCKER_PASSWORD` ou `CR_PAT` pour GHCR) et adaptez le workflow pour se connecter et pousser.

10. Smoke tests et vérifications rapides

- Exemple local : après build Docker, lancer le container backend et vérifier un endpoint `/health` ou `/` :

```bash
docker run -d -p 3000:3000 --name tafukt-backend tafukt/backend:local
curl -fsS http://localhost:3000/health || echo "health check failed"
docker stop tafukt-backend && docker rm tafukt-backend
```

11. Debug et logs

- Backend: regarder la console (stdout/stderr) ou les fichiers de logs si configurés.
- Frontend: ouvrir la console du navigateur pour erreurs JS et vérifier les requêtes réseau (onglet Network).

13. Bonnes pratiques

- Documenter toute nouvelle route dans `docs/`.
- Ajouter des tests unitaires pour les services et controllers nouveaux/critique.
- Garder les secrets hors du dépôt (utiliser `.env` et GitHub Secrets).
