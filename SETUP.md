# 🚀 SNEF Suivi Documentaire - Migration Node.js

## ✅ Ce qui a été créé

### Backend Node.js + Express
- **server.js** — Serveur Express qui écoute sur le port 3000
- **api/project.js** — Routes pour gérer le projet
- **api/documents.js** — Routes pour CRUD des documents
- **api/observations.js** — Routes pour CRUD des observations
- **api/auth.js** — Routes pour l'authentification

### Supabase
- **migrations/001_init.sql** — Schéma complet des tables
  - `projects` — Données du projet
  - `documents` — Documents à suivre
  - `observations` — Observations/remarques
  - `questions` — Questions/réponses

### Frontend Simplifié
- **public/suivi-documentaire.html** — Interface React-like (vanilla JS)
  - ✂️ Supprimé: gestion fichier réseau, verrous, IndexedDB
  - ✅ Garanti: tous les onglets, formulaires, affichage
  - 🔗 Utilise l'API Node.js pour toutes les données

## 🔧 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer Supabase
```bash
# Créer les tables dans Supabase
# Aller dans SQL Editor et exécuter: migrations/001_init.sql
```

### 3. Démarrer le serveur
```bash
npm start      # Production
npm run dev    # Développement (avec auto-reload)
```

Le serveur écoute sur `http://localhost:3000`

## 📋 Checklist de migration

- [x] API Node.js avec Express créée
- [x] Routes CRUD (documents, observations, projet)
- [x] Client Supabase configuré
- [x] Schéma SQL préparé
- [x] HTML simplifié (sans fichier réseau/verrous)
- [ ] **À FAIRE**: Exécuter le SQL dans Supabase pour créer les tables
- [ ] **À FAIRE**: Tester l'API (npm start)
- [ ] **À FAIRE**: Ajouter l'authentification Supabase Auth (optionnel)
- [ ] **À FAIRE**: Déployer sur Vercel

## 🗑️ Ce qui a été supprimé du HTML

| Fonction | Raison |
|----------|--------|
| Gestion fichier réseau (File API) | Remplacé par API REST |
| `idbOpen()`, `idbSet()`, `idbGet()` | Données directement depuis Supabase |
| `verifyPermission()`, `connectSharedFile()` | Plus besoin de permission fichier |
| `pollSharedFile()` | Plus de sync locale |
| Système de verrous (`acquireLock()`, `releaseLock()`) | Supabase gère la concurrence |
| `localStorage` comme source de vérité | Supabase est la source unique |

## 🌐 API Endpoints

### Projet
```
GET  /api/project          — Récupérer le projet
POST /api/project          — Créer/Mettre à jour le projet
```

### Documents
```
GET    /api/documents      — Tous les documents
GET    /api/documents/:id  — Un document
POST   /api/documents      — Créer un document
PUT    /api/documents/:id  — Mettre à jour
DELETE /api/documents/:id  — Supprimer
```

### Observations
```
GET    /api/observations      — Toutes les observations
POST   /api/observations      — Créer une observation
DELETE /api/observations/:id  — Supprimer
```

### Authentification
```
POST /api/auth/login            — Se connecter
POST /api/auth/change-password  — Changer le mot de passe
```

## 🔐 Authentification

Actuellement basique: mot de passe stocké dans la table `projects`.

Pour une meilleure sécurité, vous pouvez utiliser **Supabase Auth**:
1. Activer l'authentification dans Supabase
2. Mettre à jour `/api/auth.js` pour utiliser `supabase.auth`
3. Ajouter RLS (Row Level Security) sur les tables

## 📞 Prochaines étapes

1. **Exécuter le SQL**: Copiez `migrations/001_init.sql` dans Supabase SQL Editor
2. **Tester localement**: `npm start` puis ouvrez `http://localhost:3000`
3. **Peaufiner l'UI**: Le HTML de base fonctionne mais vous pouvez l'enrichir
4. **Déployer**: Utilisez Vercel (backend) + Supabase (données)

## 🆘 Troubleshooting

### CORS errors ?
Assurez-vous que le frontend et backend sont sur le même domaine ou que CORS est bien activé.

### 404 sur Supabase ?
Vérifiez que les tables ont été créées (SQL Editor → Vérifier la table dans le menu de gauche).

### Erreur de connexion ?
Vérifiez le `.env` — SUPABASE_URL et SUPABASE_KEY doivent être corrects.
