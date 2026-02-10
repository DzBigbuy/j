// Base de données locale (LocalStorage)
const DB_KEY = 'users_database';

// Récupérer les données de la base
function getDatabase() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
}

// Sauvegarder les données dans la base
function saveDatabase(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// Afficher un message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.className = 'message';
    }, 3000);
}

// Gestionnaire de soumission du formulaire
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validation
    if (!email || !password) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Créer l'objet utilisateur
    const user = {
        id: Date.now(),
        email: email,
        password: password,
        createdAt: new Date().toLocaleString('fr-FR')
    };
    
    // Récupérer la base de données actuelle
    const database = getDatabase();
    
    // Ajouter le nouvel utilisateur
    database.push(user);
    
    // Sauvegarder dans la base
    saveDatabase(database);
    
    // Afficher le message de succès
    showMessage('Données enregistrées avec succès !', 'success');
    
    // Réinitialiser le formulaire
    document.getElementById('loginForm').reset();
    
    console.log('Base de données actuelle:', database);
});

// Afficher les données enregistrées
document.getElementById('showData').addEventListener('click', function() {
    const database = getDatabase();
    const dataList = document.getElementById('dataList');
    const modal = document.getElementById('dataModal');
    
    if (database.length === 0) {
        dataList.innerHTML = `
            <div class="empty-state">
                <p>Aucune donnée enregistrée</p>
            </div>
        `;
    } else {
        dataList.innerHTML = database.map(user => `
            <div class="data-item">
                <div class="email">📧 ${escapeHtml(user.email)}</div>
                <div class="password">🔒 ${escapeHtml(user.password)}</div>
                <div class="date">📅 ${user.createdAt}</div>
            </div>
        `).join('');
    }
    
    modal.classList.add('show');
});

// Fermer le modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('dataModal').classList.remove('show');
});

// Fermer le modal en cliquant à l'extérieur
window.addEventListener('click', function(e) {
    const modal = document.getElementById('dataModal');
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Effacer la base de données
document.getElementById('clearData').addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
        localStorage.removeItem(DB_KEY);
        showMessage('Base de données effacée avec succès !', 'success');
        console.log('Base de données effacée');
    }
});

// Fonction pour échapper les caractères HTML (sécurité)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialisation
console.log('Application initialisée');
console.log('Base de données actuelle:', getDatabase());