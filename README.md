# Tafukt Trail — Gestion de flotte routière

Application full-stack de gestion de flotte : camions, remorques, pneus,
carburant, trajets, maintenance préventive et rapports. Backend **Node.js
(Express) + MongoDB**, frontend **Vite + React**.

## Démarrage rapide (5 minutes)

Prérequis : Node 20+, Docker (pour MongoDB local).

```bash
# 1. Variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# -> backend/.env : renseignez JWT_SECRET (32+ caractères aléatoires).
#    Sans JWT_SECRET valide, le serveur refuse de démarrer.

# 2. Base de données locale
docker run -d --name tafukt_mongo -p 27017:27017 -v tafukt_mongo_data:/data/db mongo:5.0
# (ou : docker compose up -d mongo — voir docker-compose.yml)

# 3. Backend
cd backend && npm ci && npm test && npm run seed && npm run dev
# API : http://localhost:5223 — comptes démo ci-dessous

# 4. Frontend (autre terminal)
cd frontend && npm ci && npm run dev -- --port 5174
# App : http://localhost:5174
```

Ou tout en Docker : `docker compose up --build` (mongo + backend + frontend,
réseau `tafukt-net`). Pensez à `JWT_SECRET` dans l'environnement.

## Comptes démo (seed)

| Rôle      | Email               | Mot de passe |
|-----------|---------------------|--------------|
| ADMIN     | admin@tafukt.ma     | Admin123!    |
| CHAUFFEUR | yassine@tafukt.ma   | Driver123!   |

Le seed crée aussi 2 camions et 1 trajet Casa → Agadir. Relancez
`npm run seed` sans risque : il est idempotent.

## Architecture

```
backend/src/
  routes/ → controllers/ → services/ → repositories/ → models/
  middlewares/  auth (JWT), authorize (rôles), validateObjectId, erreurs
  validators/   Joi par ressource (dont maintenance)
  enums/        statuts, rôles, types (source unique de vérité)
  tests/unit/   61 tests (services réels, repos mockés)
frontend/src/
  pages/        Home, auth, admin/*, chauffeur/*
  services/     appels API (VITE_API_URL doit finir par /api/v1)
  context/      AuthContext (JWT + expiry)
  components/   Layout, Navbar, ProtectedRoute
```

Règles : rôles `ADMIN`/`CHAUFFEUR` (inscription publique = CHAUFFEUR
toujours), statuts trajet `PLANIFIE → EN_COURS → TERMINE` (transitions
validées), `kilometrageActuel` auto-montant à la clôture, alertes
maintenance au seuil km (`KM_SEUIL`).

## Scripts

| Dossier   | Commande         | Effet                              |
|-----------|------------------|------------------------------------|
| backend   | `npm test`       | 61 tests unitaires                  |
| backend   | `npm run seed`   | démo idempotente                    |
| backend   | `npm run dev`    | nodemon sur 5223                    |
| backend   | `npx eslint .`   | 0 erreur                            |
| frontend  | `npm run dev`    | Vite (pensez `--port 5174`)         |
| frontend  | `npm run build`  | build prod                          |

## Sécurité

- `.env` jamais versionnés (`.gitignore` racine + backend). Si un secret a
  fuité dans l'historique : révoquez-le puis purgez l'historique.
- Rate-limit sur `/api/v1/auth`, CORS restreint via `CORS_ORIGIN`,
  erreurs normalisées sans stack en prod, ObjectId validés (400, pas 500).
