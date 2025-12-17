<div align="center">
	<img src="frontend/public/logo.png" alt="Tafukt Trial logo" style="max-width:220px;width:40%;height:auto;margin-bottom:8px;" />
	<br/>
	<video src="frontend/public/demo.mp4" controls muted autoplay loop playsinline style="max-width:960px;width:100%;height:auto;">
		Votre navigateur ne supporte pas la balise vidéo.
	</video>
</div>

# Tafukt Trial

Description
-----------

Tafukt Trial est une application full-stack pour gérer des véhicules, interventions de maintenance, pleins de carburant, pneus, remorques et trajets. Le projet contient un backend Node.js (Express) et un frontend (Vite + React).

Ce README explique comment installer, lancer, tester, construire des images Docker, utiliser le workflow CI et fournir une démo vidéo locale et les diagrammes.

Structure du dépôt
--------------------

- `backend/` : API Node.js, tests, configuration.
- `frontend/` : interface utilisateur Vite/React.
- `docs/` : documentation technique et utilisateur, présentation, livrables.
- `docker-compose.yml` : orchestration locale (si utilisée).
- `.github/workflows/ci-cd.yml` : workflow GitHub Actions (CI minimal).

Prérequis
----------

- Node.js 18+ ou 20+ (selon la configuration du workflow)
- npm ou yarn
- Docker (optionnel pour exécuter via conteneurs)
- Git

Installation locale
-------------------

1. Cloner le dépôt et se placer à la racine :

```bash
git clone https://github.com/Abdelhakim-Baalla/Tafukt-Trail
cd "Tafukt Trial"
```

2. Backend :

```bash
cd backend
npm ci
npm test        # lancer la suite de tests
npm run dev     # lancer en mode développement (si défini)
```

3. Frontend :

```bash
cd frontend
npm ci
npm run dev     # lancement du serveur de dev
npm run build   # build de production
```

Variables d'environnement
-------------------------

Consultez `backend/.env.example` et créez un fichier `backend/.env` avec les variables requises (ex : `PORT`, `DATABASE_URL`, `JWT_SECRET`).

Docker (manuel, très simple)
-----------------------------

Construire les images :

```bash
docker build -t tafukt/backend:local ./backend
docker build -t tafukt/frontend:local ./frontend
```

Run (exemple backend) :

```bash
docker run --rm -p 3000:3000 -e PORT=3000 tafukt/backend:local
```

CI / GitHub Actions
-------------------

Le workflow est défini dans `.github/workflows/ci-cd.yml` et contient des jobs pour :

- installer et tester le backend
- installer et builder le frontend
- construire des images Docker (job `docker-build`)
- exécuter des smoke tests simple (job `smoke-test`)

Diagrammes et UML
-----------------

Les diagrammes se trouvent dans `docs/UML/`. Par exemple, ouvrez `docs/UML/tafukt-trial.mdj` (fichier de projet pour un outil de diagramme) ou exportez les images depuis ce dossier.

Bonnes pratiques et contributions
---------------------------------

- Respectez la structure des dossiers et les conventions de nommage.
- Ouvrez une branche par fonctionnalité/bugfix et créez une PR pour revue.

Commande utiles recap
---------------------

- Installer dépendances backend : `cd backend && npm ci`
- Lancer tests backend : `cd backend && npm test`
- Installer dépendances frontend : `cd frontend && npm ci`
- Builder frontend : `cd frontend && npm run build`
- Construire images Docker : `docker build -t tafukt/backend:local ./backend`
