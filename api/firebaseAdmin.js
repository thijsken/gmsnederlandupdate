import admin from 'firebase-admin';

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (e) {
  console.error('FIREBASE_SERVICE_ACCOUNT is ongeldig:', e);
  throw e;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // eventueel databaseURL erbij als je realtime database gebruikt
    // databaseURL: "https://<project-id>.firebaseio.com"
  });
}

export default admin;
