const { initializeApp, cert, getApps } = require("firebase-admin/app");

if (!getApps().length) {
  let credential;

  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Vercel
    credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  } else {
    // Local Development
    const serviceAccount = require("../../firebase/serviceAccountKey.json");

    credential = cert(serviceAccount);
  }

  initializeApp({
    credential,
  });
}
