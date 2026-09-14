// ========================================
// AUTHENTICATION SNEF + FIREBASE
// ========================================

// Initialiser Firebase (ajouter après firebaseConfig)
const db = firebase.database();
const auth = firebase.auth();

let currentUser = null;
let allUsers = {};

// ========================================
// 1. CHARGER LA LISTE DES USERS SNEF
// ========================================

// Au démarrage, charger tous les users autorisés
db.ref('users').on('value', (snapshot) => {
  allUsers = snapshot.val() || {};
  console.log('✅ Base users SNEF chargée:', Object.keys(allUsers).length, 'users');
});

// ========================================
// 2. CREER UN NOUVEAU USER SNEF
// ========================================

function registerSNEFUser(email, password, nom, role = 'viewer') {
  // Vérifier que c'est un email SNEF
  if (!email.includes('@snef.fr') && !email.includes('@snef.com')) {
    showToast('❌ Email SNEF requis (@snef.fr ou @snef.com)', 'error');
    return;
  }

  // Créer compte Firebase Auth
  auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
    const uid = userCredential.user.uid;

    // Enregistrer le profil dans la base
    db.ref(`users/${uid}`).set({
      email: email,
      nom: nom,
      role: role, // 'admin', 'editor', 'viewer'
      dateInscription: new Date().toISOString(),
      actif: true,
      derniereConnexion: new Date().toISOString()
    }).then(() => {
      showToast(`✅ Utilisateur ${nom} créé!`, 'success');
      console.log('User enregistré:', uid, email);
    });

  }).catch((error) => {
    showToast(`❌ Erreur: ${error.message}`, 'error');
  });
}

// ========================================
// 3. LOGIN SNEF
// ========================================

function loginSNEF(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;

      // Récupérer les infos du user
      db.ref(`users/${uid}`).once('value', (snapshot) => {
        const userData = snapshot.val();

        if (!userData) {
          showToast('❌ User non enregistré', 'error');
          auth.signOut();
          return;
        }

        // Mettre à jour dernière connexion
        db.ref(`users/${uid}`).update({
          derniereConnexion: new Date().toISOString()
        });

        currentUser = {
          uid: uid,
          email: email,
          nom: userData.nom,
          role: userData.role,
          actif: true
        };

        console.log('✅ Connecté:', currentUser.nom);
        showToast(`👋 Bienvenue ${currentUser.nom}!`, 'success');
        updateAuthUI();
        loadProjectData();
      });
    })
    .catch((error) => {
      showToast(`❌ Login échoué: ${error.message}`, 'error');
    });
}

// ========================================
// 4. LOGOUT
// ========================================

function logoutSNEF() {
  auth.signOut().then(() => {
    currentUser = null;
    showToast('👋 Déconnecté', 'success');
    updateAuthUI();
  });
}

// ========================================
// 5. METTRE À JOUR L'UI SELON AUTH
// ========================================

function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userBadge = document.getElementById('userBadge');
  const syncBadge = document.getElementById('syncBadge');

  if (currentUser) {
    // Utilisateur connecté
    authBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    userBadge.textContent = `✅ ${currentUser.nom} (${currentUser.role})`;
    syncBadge.textContent = '🟢 En ligne - Synchronisé';
    syncBadge.style.cursor = 'default';

    // Activer les boutons de modification
    enableEditButtons();
  } else {
    // Pas connecté
    authBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    userBadge.textContent = '👁 Lecture seule';
    syncBadge.textContent = '🔴 Hors ligne - Lecture seule';

    // Désactiver les boutons de modification
    disableEditButtons();
  }
}

// ========================================
// 6. VÉRIFIER PERMISSIONS AVANT MODIF
// ========================================

function canEdit() {
  if (!currentUser) {
    showToast('🔐 Vous devez vous connecter pour modifier', 'error');
    requireAuthModal();
    return false;
  }

  if (currentUser.role === 'viewer') {
    showToast('🚫 Vous n\'avez pas la permission de modifier', 'error');
    return false;
  }

  return true;
}

// ========================================
// 7. ENREGISTRER UNE ACTION (HISTORIQUE)
// ========================================

function logAction(docNum, phase, action, details = {}) {
  if (!currentUser) return;

  const timestamp = new Date().toISOString();

  db.ref(`projets/snef2024/documents/${docNum}/phases/${phase}/historique/${timestamp}`).set({
    action: action,
    auteur: currentUser.nom,
    auteurEmail: currentUser.email,
    auteurUID: currentUser.uid,
    role: currentUser.role,
    timestamp: Date.now(),
    ...details
  }).catch((error) => {
    console.error('Erreur enregistrement action:', error);
  });
}

// ========================================
// 8. SAUVEGARDER UN DOCUMENT
// ========================================

function saveDocument() {
  if (!canEdit()) return;

  const doc = {
    num: document.getElementById('docNum').value,
    title: document.getElementById('docTitle').value,
    indice: document.getElementById('docIndice').value,
    heures: parseFloat(document.getElementById('docHeures').value) || 0,
    heuresBPO: parseFloat(document.getElementById('docHBPO').value) || 0,
    heuresBPE: parseFloat(document.getElementById('docHBPE').value) || 0,
    datePrev: document.getElementById('docDatePrev').value,
    phase: document.getElementById('docPhase').value,
    dateCreation: new Date().toISOString(),
    creerPar: currentUser.nom,
    creerParUID: currentUser.uid,
    avancement: 0,
    statut: 'notstarted'
  };

  const docKey = doc.num.replace(/\//g, '_');

  db.ref(`projets/snef2024/documents/${docKey}`).set(doc).then(() => {
    showToast(`✅ Document ${doc.num} créé par ${currentUser.nom}`, 'success');
    logAction(docKey, 'GENERAL', `Document créé: ${doc.title}`);
    closeModal('docModal');
  }).catch((error) => {
    showToast(`❌ Erreur: ${error.message}`, 'error');
  });
}

// ========================================
// 9. METTRE À JOUR AVANCEMENT
// ========================================

function updateAvancement(docNum, phase, pourcentage) {
  if (!canEdit()) return;

  const timestamp = new Date().toISOString();

  db.ref(`projets/snef2024/documents/${docNum}/phases/${phase}`).update({
    avancement: pourcentage,
    dateMAJ: timestamp,
    majPar: currentUser.nom
  }).then(() => {
    logAction(docNum, phase, `Avancement: ${pourcentage}%`, {
      pourcentage: pourcentage
    });
    showToast(`✅ ${pourcentage}% enregistré`, 'success');
  }).catch((error) => {
    showToast(`❌ Erreur: ${error.message}`, 'error');
  });
}

// ========================================
// 10. MODAL LOGIN SNEF
// ========================================

function requireAuthModal() {
  const overlay = document.getElementById('authOverlay');
  overlay.classList.add('open');
}

function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
}

function doLoginSNEF() {
  const email = document.getElementById('authName').value || document.getElementById('authEmail')?.value;
  const password = document.getElementById('authPass').value;

  if (!email || !password) {
    showToast('❌ Email et mot de passe requis', 'error');
    return;
  }

  loginSNEF(email, password);
  closeAuthModal();
}

// ========================================
// 11. CREER ADMIN INITIAL (une seule fois)
// ========================================

function createInitialAdmin() {
  // À exécuter UNE FOIS dans la console pour créer l'admin SNEF
  registerSNEFUser('admin@snef.fr', 'snef2024', 'Admin SNEF', 'admin');
}

// ========================================
// 12. AFFICHER LES USERS CONNECTÉS
// ========================================

function showConnectedUsers() {
  db.ref('users').once('value', (snapshot) => {
    const users = snapshot.val() || {};
    let html = '<h3>Utilisateurs SNEF enregistrés</h3><table class="table" style="font-size:12px"><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Dernière connexion</th></tr>';

    Object.values(users).forEach(user => {
      const lastLogin = new Date(user.derniereConnexion).toLocaleDateString('fr-FR');
      html += `<tr>
        <td>${user.nom}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${lastLogin}</td>
      </tr>`;
    });

    html += '</table>';
    console.log(html);
  });
}
