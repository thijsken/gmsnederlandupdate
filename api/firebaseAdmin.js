const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: 'https://gmsnederland-3029e.firebaseio.com'  // Pas aan naar jouw DB URL
  });
}

const realtimeDb = admin.database();

module.exports = { realtimeDb };

