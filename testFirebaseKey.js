require('dotenv').config();

const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
console.log('Raw private key from env:');
console.log(privateKeyRaw);

const privateKeyParsed = privateKeyRaw.replace(/\\n/g, '\n');
console.log('\nParsed private key with real new lines:');
console.log(privateKeyParsed);

// Check of de key begint en eindigt met de juiste headers:
const isValidStart = privateKeyParsed.startsWith('-----BEGIN PRIVATE KEY-----');
const isValidEnd = privateKeyParsed.trim().endsWith('-----END PRIVATE KEY-----');

console.log('\nKey valid start? ', isValidStart);
console.log('Key valid end? ', isValidEnd);
