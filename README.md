# 📊 SNEF – Suivi Documentaire Études

Application Node.js + Supabase pour le suivi des documents et observations d'études techniques.

## 🎯 Vue d'ensemble

- **Frontend** : HTML/CSS/JS vanilla (dans `/public`)
- **Backend** : Express.js avec API REST
- **Base de données** : Supabase (PostgreSQL)
- **Déploiement** : Vercel (backend) + Supabase (BDD)

## 🏗️ Structure

```
├── server.js              # Serveur Express
├── supabaseClient.js      # Client Supabase
├── package.json           # Dépendances
├── .env                   # Variables d'environnement
├── .env.example           # Template .env
├── api/
│   ├── project.js         # Routes projet
│   ├── documents.js       # Routes documents
│   ├── observations.js    # Routes observations
│   └── auth.js            # Routes authentification
├── public/
│   └── suivi-documentaire.html  # Interface web
├── migrations/
│   └── 001_init.sql       # Schéma Supabase
├── SETUP.md               # Guide d'installation
└── README.md              # Ce fichier
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+
- Compte Supabase

### Installation
```bash
npm install
npm start
```

Ouvrez `http://localhost:3000`

## 📚 Voir aussi

- [SETUP.md](SETUP.md) — Guide détaillé d'installation et migration
- [migrations/001_init.sql](migrations/001_init.sql) — Schéma de base de données
- [public/suivi-documentaire.html](public/suivi-documentaire.html) — Interface web

## 📝 Fonctionnalités

- ✅ Gestion des projets
- ✅ Suivi des documents (indice, rédacteur, contrôleur, vérificateur)
- ✅ Observations et remarques
- ✅ Authentification par mot de passe
- ✅ Dashboard avec KPIs

## 🔄 Différences avec l'ancienne version

| Avant | Après |
|-------|-------|
| Fichier JSON sur réseau | Supabase PostgreSQL |
| Synchronisation locale toutes les 10s | Temps réel via API |
| Verrous locaux | Gestion d'accès Supabase |
| localStorage comme backup | Supabase comme source unique |
| Navigateur seul | Architecture client-serveur |

## 💡 Améliorations futures

- [ ] Authentification multi-utilisateur (Supabase Auth)
- [ ] Notifications temps réel (Supabase Realtime)
- [ ] Export PDF/Excel amélioré
- [ ] Historique des modifications (audit trail)
- [ ] Webhooks pour intégrations externes

## 📞 Support

Pour les problèmes d'installation, voir [SETUP.md](SETUP.md#-troubleshooting)
