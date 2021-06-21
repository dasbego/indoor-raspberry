const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

const serviceCredentials = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  // eslint-disable-next-line
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
};

// firebase credentials
const app = express();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// initialize db
admin.initializeApp({
  credential: admin.credential.cert(serviceCredentials),
  databaseURL: "https://indoorv2-default-rtdb.firebaseio.com"
});
const db = admin.database();

app.get("/", (req: any, res: any) => {
  return res.status(200).json({ message: "API de Indoor House" });
})
app.get("/plants", async (req: any, res: any) => {
  const plants = await db.ref().child("plants").get();
  if (plants) {
    return res.status(200).json({ plants: plants })
  } else {
    return res.status(404).json({
      message: "No se encontró ningun registro de plantas"
    })
  }
})
app.get("/records", async (req: any, res: any) => {
  let records
  try {
    records = await db.ref().child("records").get();
  } catch (e) {
    return res.status(500).json({ message: 'Error al leer datos de Records', error: e })
  }
  if (records) {
    return res.status(200).json({ records: records })
  } else {
    return res.status(404).json({ message: "No se encontró ningun registro" })
  }
})

app.post("/records", async (req: any, res: any) => {
  const newPlant = req.body;
  if (newPlant) {
    try {
      // save to db
      await db.ref().child("records").push(newPlant)
    } catch (e) {
      return res.status(500).json({
        message: "Error de Firebase mientras se guardaban registros en Records"
      })
    }
    return res.status(200).json({ newPlant })
  } else {
    return res.status(400).json({ message: "No se encontraron records" })
  }
})

app.get("/auth/firebase-credentails", async (req: any, res: any) => {
  const firebaseConfig = req.body;
  // Look for required fields

})

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
}

exports.indoorapi = functions.runWith(runtimeOpts).https.onRequest(app);
