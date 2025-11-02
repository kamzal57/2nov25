# DocPro Elite 🚀

**Un éditeur de documents collaboratif moderne et professionnel**

DocPro Elite est une application SaaS complète construite avec Next.js 14, TypeScript, Supabase et Tiptap. Elle offre une expérience d'édition de documents WYSIWYG (Ce que vous voyez est ce que vous obtenez) de niveau professionnel, similaire à Notion, Google Docs ou Coda.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## ✨ Fonctionnalités Principales

### 🎨 Éditeur WYSIWYG Avancé
- **Éditeur basé sur Tiptap/ProseMirror** : Édition en temps réel sans split-screen
- **Commandes Slash (/)** : Menu contextuel pour insérer rapidement des blocs
- **Menu Flottant** : Formatage de texte (gras, italique, lien, couleur, surlignage)
- **Blocs Personnalisés** :
  - QCM interactifs avec plusieurs options
  - Tableaux éditables (ajouter/supprimer lignes/colonnes)
  - Blocs de code avec coloration syntaxique (Shiki)
  - Listes à puces, numérotées et de tâches
  - Citations, séparateurs et plus

### 🤝 Collaboration en Temps Réel
- **Synchronisation instantanée** via Supabase Realtime
- **Système de commentaires** : Threads de discussion sur les documents
- **Gestion des permissions** : Lecture seule, commentaire, édition, admin
- **Partage public** : Génération de liens publics pour vos documents
- **Indicateurs de présence** : Voyez qui travaille sur le document

### 🔐 Authentification Complète
- **Email/Mot de passe** : Inscription et connexion classiques
- **OAuth** : Connexion via Google et GitHub
- **Gestion de session** : Protection des routes avec middleware
- **Profils utilisateurs** : Avatars et informations personnelles

### 📁 Organisation Avancée
- **Système de dossiers** : Arborescence complète avec sous-dossiers
- **Sidebar redimensionnable** : Interface adaptable à vos besoins
- **Recherche globale** : Recherche instantanée dans tous vos documents (Cmd+K)
- **Historique des versions** : Système de snapshots pour restaurer des versions antérieures

### 🎨 Design Premium
- **Mode clair/sombre** : Synchronisé avec les préférences système
- **Design minimaliste** : Interface épurée et professionnelle
- **Animations subtiles** : Transitions fluides avec Framer Motion
- **Responsive** : Adapté à tous les écrans

### 🤖 Fonctionnalités IA (Planifiées)
- **Génération de contenu** : "Continuer l'écriture", "Brainstormer des idées"
- **Édition intelligente** : "Résumer", "Corriger la grammaire", "Améliorer le style"

## 🏗️ Architecture Technique

### Stack Technologique

```
Frontend:
├── Next.js 14 (App Router)
├── TypeScript (strict mode)
├── React 18
├── Tailwind CSS
└── Framer Motion

Éditeur:
├── Tiptap 2.x
├── ProseMirror
├── Shiki (coloration syntaxique)
└── Custom Node Views React

Backend/BaaS:
├── Supabase Auth
├── Supabase Database (PostgreSQL)
├── Supabase Realtime
└── Row Level Security (RLS)

State Management:
├── Zustand
└── React Context

UI/Icons:
├── lucide-react
└── Custom CSS Variables
```

### Structure du Projet

```
docpro-elite/
├── app/
│   ├── (app)/                    # Routes protégées
│   │   ├── layout.tsx           # Layout principal avec sidebar
│   │   ├── page.tsx             # Page d'accueil de l'app
│   │   └── documents/
│   │       └── [docId]/
│   │           └── page.tsx     # Page d'édition de document
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts         # Callback OAuth
│   ├── login/
│   │   └── page.tsx             # Page de connexion
│   ├── signup/
│   │   └── page.tsx             # Page d'inscription
│   ├── layout.tsx               # Layout racine
│   ├── page.tsx                 # Page d'accueil (redirect)
│   └── globals.css              # Styles globaux
├── components/
│   ├── editor/
│   │   ├── editor.tsx           # Composant éditeur principal
│   │   ├── bubble-menu.tsx      # Menu de formatage flottant
│   │   ├── slash-command.ts     # Extension commande slash
│   │   ├── slash-command-list.tsx
│   │   ├── extensions/          # Extensions Tiptap custom
│   │   │   ├── qcm-extension.ts
│   │   │   └── code-block-extension.ts
│   │   └── nodes/               # Node Views React
│   │       ├── qcm-node-view.tsx
│   │       └── code-block-node-view.tsx
│   ├── comments/
│   │   └── comments-panel.tsx   # Panel de commentaires
│   ├── providers/
│   │   └── theme-provider.tsx   # Provider de thème
│   ├── header.tsx               # Header de l'app
│   └── sidebar.tsx              # Sidebar avec arborescence
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Client Supabase (browser)
│   │   ├── server.ts            # Client Supabase (server)
│   │   └── database.types.ts    # Types TypeScript générés
│   ├── store.ts                 # Store Zustand
│   └── utils.ts                 # Fonctions utilitaires
├── supabase/
│   └── schema.sql               # Schéma de base de données
├── middleware.ts                # Middleware d'authentification
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** 18+ et npm/yarn/pnpm
- **Compte Supabase** : [supabase.com](https://supabase.com)
- **Compte OpenAI** (optionnel) : Pour les fonctionnalités IA

### Étape 1 : Installation des dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### Étape 2 : Configuration Supabase

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)

2. **Exécuter le schéma SQL** :
   - Ouvrez l'éditeur SQL dans votre dashboard Supabase
   - Copiez et exécutez le contenu de `supabase/schema.sql`
   - Cela créera toutes les tables, fonctions, triggers et policies RLS

3. **Activer l'authentification OAuth** (optionnel) :
   - Dans Supabase Dashboard → Authentication → Providers
   - Activez Google et/ou GitHub
   - Configurez les URLs de redirection

4. **Activer Realtime** :
   - Dans Supabase Dashboard → Database → Replication
   - Vérifiez que les tables sont bien publiées (c'est fait automatiquement par le schéma)

### Étape 3 : Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# OpenAI API (optionnel - pour les fonctionnalités IA)
OPENAI_API_KEY=sk-votre-cle-openai

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Comment obtenir les clés Supabase :**
- Dashboard Supabase → Settings → API
- Copiez `Project URL` et `anon public key`

### Étape 4 : Lancer l'application

```bash
# Mode développement
npm run dev

# Build de production
npm run build
npm run start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📖 Guide d'utilisation

### Premiers pas

1. **Inscription/Connexion** :
   - Créez un compte via email ou OAuth (Google/GitHub)
   - Confirmez votre email si nécessaire

2. **Créer un document** :
   - Cliquez sur le bouton "Nouveau" dans la sidebar
   - Commencez à taper pour éditer

3. **Utiliser les commandes slash** :
   - Tapez `/` pour ouvrir le menu de commandes
   - Sélectionnez un bloc (Titre, Liste, QCM, Code, etc.)

4. **Formater du texte** :
   - Sélectionnez du texte pour afficher le menu flottant
   - Appliquez du gras, italique, liens, couleurs, etc.

5. **Organiser vos documents** :
   - Créez des dossiers avec le bouton dossier
   - Glissez-déposez des documents dans les dossiers

### Collaboration

1. **Partager un document** :
   - Cliquez sur "Partager" dans le header
   - Invitez des collaborateurs par email
   - Définissez les permissions (lecture, commentaire, édition)

2. **Commenter** :
   - Cliquez sur l'icône de commentaire dans le header
   - Ajoutez des commentaires et répondez aux threads

3. **Voir qui est en ligne** :
   - Les avatars des collaborateurs actifs s'affichent dans le header

### Raccourcis clavier

- **Cmd/Ctrl + B** : Gras
- **Cmd/Ctrl + I** : Italique
- **Cmd/Ctrl + K** : Recherche globale
- **/** : Commandes slash
- **Cmd/Ctrl + Z** : Annuler
- **Cmd/Ctrl + Shift + Z** : Rétablir

## 🗄️ Schéma de Base de Données

### Tables Principales

**profiles** : Profils utilisateurs (extension de auth.users)
- `id` (UUID, PK)
- `email`, `full_name`, `avatar_url`
- `created_at`, `updated_at`

**folders** : Dossiers pour organiser les documents
- `id` (UUID, PK)
- `name`, `parent_id` (self-reference)
- `owner_id` (FK → profiles)
- `position`, `created_at`, `updated_at`

**documents** : Documents principaux
- `id` (UUID, PK)
- `title`, `content` (JSONB - contenu Tiptap)
- `folder_id` (FK → folders)
- `owner_id` (FK → profiles)
- `is_public`, `public_id`, `icon`
- `created_at`, `updated_at`, `last_edited_by`

**document_collaborators** : Gestion des permissions
- `id` (UUID, PK)
- `document_id` (FK → documents)
- `user_id` (FK → profiles)
- `permission` (ENUM: view, comment, edit, admin)
- `invited_by`, `created_at`

**comments** : Système de commentaires
- `id` (UUID, PK)
- `document_id` (FK → documents)
- `user_id` (FK → profiles)
- `parent_id` (FK → comments, pour les threads)
- `content`, `selection_from`, `selection_to`
- `resolved`, `created_at`, `updated_at`

**document_versions** : Historique des versions
- `id` (UUID, PK)
- `document_id` (FK → documents)
- `content` (JSONB)
- `version_number`, `created_by`, `created_at`

**active_users** : Présence en temps réel
- `id` (UUID, PK)
- `document_id` (FK → documents)
- `user_id` (FK → profiles)
- `cursor_position` (JSONB)
- `last_seen`

### Sécurité (Row Level Security)

Toutes les tables ont des policies RLS activées :
- Les utilisateurs ne voient que leurs propres données
- Les collaborateurs ont accès selon leurs permissions
- Les documents publics sont accessibles à tous

## 🎨 Personnalisation

### Thème et Couleurs

Les couleurs sont définies dans `app/globals.css` avec des variables CSS :

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  /* ... */
}
```

Modifiez ces valeurs pour changer la palette de couleurs.

### Ajouter des Extensions Tiptap

1. Créez une nouvelle extension dans `components/editor/extensions/`
2. Créez une Node View React dans `components/editor/nodes/`
3. Importez et ajoutez l'extension dans `editor.tsx`

Exemple :

```typescript
// components/editor/extensions/custom-extension.ts
import { Node } from '@tiptap/core'

export const CustomExtension = Node.create({
  name: 'custom',
  // ... configuration
})
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Push sur GitHub** :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/docpro-elite.git
   git push -u origin main
   ```

2. **Déployer sur Vercel** :
   - Connectez votre repo GitHub à Vercel
   - Ajoutez les variables d'environnement
   - Déployez !

3. **Configurer Supabase** :
   - Ajoutez l'URL de production dans Supabase Auth → URL Configuration
   - Mettez à jour `NEXT_PUBLIC_APP_URL`

### Autres Plateformes

L'application est compatible avec :
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tiptap](https://tiptap.dev/) - Éditeur WYSIWYG
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Icônes
- [Shiki](https://shiki.matsu.io/) - Coloration syntaxique

## 📧 Contact

Pour toute question ou suggestion :
- **Email** : contact@docpro-elite.com
- **GitHub Issues** : [github.com/username/docpro-elite/issues](https://github.com/username/docpro-elite/issues)

---

**Développé avec ❤️ par l'équipe DocPro Elite**