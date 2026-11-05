const fs = require('fs');
const path = require('path');

// Preluăm conținutul din variabila de mediu trimisă de GitHub Actions
const issueBody = process.env.ISSUE_BODY || '';
console.log("Conținut Issue primit:\n", issueBody);

// Funcție pentru extragerea datelor din corpul Issue-ului
function parseIssueBody(body) {
    const lines = body.split('\n');
    let name = 'Oaspete';
    let rating = 5;
    let message = '';

    lines.forEach(line => {
        const lower = line.toLowerCase();
        if (lower.startsWith('name:') || lower.startsWith('nume:')) {
            name = line.split(/:(.+)/)[1].trim();
        } else if (lower.startsWith('rating:')) {
            rating = parseInt(line.split(/:(.+)/)[1].trim(), 10) || 5;
        } else if (lower.startsWith('message:') || lower.startsWith('mesaj:')) {
            message = line.split(/:(.+)/)[1].trim();
        }
    });

    // Dacă formatul nu conține chei stricte, preluăm tot textul ca mesaj
    if (!message && body.trim()) {
        message = body.trim();
    }

    return {
        name: name || 'Oaspete',
        rating: isNaN(rating) ? 5 : rating,
        message: message || 'Fără mesaj',
        date: new Date().toISOString().split('T')[0] // Data curentă (YYYY-MM-DD)
    };
}

const newReview = parseIssueBody(issueBody);
const filePath = path.join(__dirname, 'reviews.json');
let reviews = [];

// Citim recenziile existente, dacă fișierul există
if (fs.existsSync(filePath)) {
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        reviews = JSON.parse(fileData);
    } catch (e) {
        console.error("Eroare la citirea reviews.json:", e);
    }
}

// Adăugăm recenzia nouă la începutul listei
reviews.unshift(newReview);

// Salvăm fișierul JSON actualizat
fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), 'utf8');
console.log("Recenzia a fost adăugată cu succes în reviews.json:", newReview);
