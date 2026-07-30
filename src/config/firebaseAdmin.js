const { initializeApp, cert, getApps } = require("firebase-admin/app");

const serviceAccount = require("../../firebase/serviceAccountKey.json");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
