# NexusCRM

**NexusCRM** est une application web complète de Gestion de la Relation Client (CRM), construite sur une architecture moderne séparant le Backend et le Frontend. Elle permet aux entreprises de centraliser, gérer et analyser leurs interactions avec leurs clients et prospects.

---

## Technologies Utilisées

*   **Backend** : Python, Django, Django REST Framework (DRF), JWT (Authentification)
*   **Frontend** : JavaScript, React.js, Vite, Bootstrap/Tailwind
*   **Base de données** : MySQL
*   **Déploiement** : Docker, Nginx, Gunicorn, WhiteNoise, prêt pour [Railway](https://railway.app)

---

## Fonctionnalités Principales & Cas d'Utilisation

NexusCRM est conçu pour simplifier la vie des équipes de vente et de gestion. Voici ses principales fonctionnalités :

1.  **Tableau de Bord (Dashboard) Analytique**
    *   *Cas d'utilisation :* Le directeur des ventes se connecte le matin et consulte un résumé visuel (graphiques) des ventes récentes, du nombre de nouveaux prospects et des tâches à accomplir.
2.  **Gestion des Clients et Contacts**
    *   *Cas d'utilisation :* Un commercial ajoute une nouvelle entreprise cliente, incluant les informations de contact, l'historique des échanges, et les documents associés pour avoir une vue 360° du client.
3.  **Suivi des Prospects (Leads)**
    *   *Cas d'utilisation :* Suivre un prospect depuis le premier contact jusqu'à la conclusion de la vente. Possibilité de changer le statut d'un prospect (ex: "Nouveau", "Contacté", "En Négociation", "Gagné/Perdu").
4.  **Authentification et Sécurité (JWT)**
    *   *Cas d'utilisation :* L'application différencie les simples commerciaux des administrateurs, garantissant que chacun a uniquement accès aux données dont il a besoin pour travailler.
5.  **Interface Réactive et Moderne**
    *   *Cas d'utilisation :* Grâce à l'utilisation de React et Vite, l'interface est extrêmement fluide, ne nécessite pas de rechargement de page, et s'adapte à différents écrans.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

*   **Python** (3.10 ou supérieur)
*   **Node.js** (v18 ou supérieur) et **npm**
*   **MySQL** (optionnel pour le dev local, obligatoire pour la production)
*   **Git**

---

## Guide d'Installation (Local)

Suivez ces étapes pour configurer le projet sur votre machine locale.

### 1. Cloner le dépôt
```bash
git clone <URL_DE_VOTRE_DEPOT>
cd NexusCRM
```

### 2. Configuration du Backend (Django)
```bash
cd backend

# Créer un environnement virtuel
python -m venv env

# Activer l'environnement virtuel
# Sur Windows :
env\Scripts\activate
# Sur Mac/Linux :
source env/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier d'environnement et configurer les variables
cp .env.example .env
# -> Éditez le fichier .env selon vos besoins (DB, Secret Key, etc.)

# Appliquer les migrations de base de données
python manage.py migrate

# Créer un super-utilisateur (Administrateur)
python manage.py createsuperuser
```

### 3. Configuration du Frontend (React)
Ouvrez un nouveau terminal et placez-vous à la racine du projet.
```bash
cd frontend

# Installer les dépendances Node.js
npm install

# Copier le fichier d'environnement
cp .env.example .env
# -> Assurez-vous que VITE_API_URL pointe vers http://127.0.0.1:8000 en local
```

---

## Guide de Démarrage (Lancement)

Pour faire fonctionner l'application, vous devez lancer le backend et le frontend en même temps dans deux terminaux séparés.

### Lancer le Backend (Terminal 1)
```bash
cd backend
# Assurez-vous que l'environnement virtuel est activé
python manage.py runserver
```
Le backend sera disponible sur : `http://127.0.0.1:8000`

### Lancer le Frontend (Terminal 2)
```bash
cd frontend
npm run preview   # ou npm run dev (selon votre package.json)
```
Le frontend sera généralement disponible sur : `http://localhost:3000`.

---

## Déploiement (Production)

L'application est configurée avec des `Dockerfile` pour le frontend et le backend, ce qui la rend prête à être déployée sur n'importe quel service supportant Docker (comme **Railway**, AWS, Heroku, etc.).

1. **Backend** : Utilise `Gunicorn` et `WhiteNoise` pour servir l'API Django et les fichiers statiques de l'admin.
2. **Frontend** : Utilise un build multi-étapes Docker avec `Nginx` pour servir l'application React compilée de manière ultra-rapide.