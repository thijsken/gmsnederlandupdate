const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('./confige/gmsnederland-3029e-firebase-adminsdk-fbsvc-c900bf64b5.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederland-3029e.firebaseio.com'  // let op juiste databaseURL voor Realtime DB
  });
}

const firestore = admin.firestore();
const db = admin.database();  // db is hier de Realtime Database

module.exports = { admin, firestore, db };
