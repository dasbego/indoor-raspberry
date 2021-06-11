const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

const service_credentials = {
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/<your_service_account>"
};

// firebase credentials
const app = express();

console.log(__dirname)
// initialize db
admin.initializeApp({
  credential: admin.credential.cert(service_credentials),
  databaseURL: "https://indoorv2-default-rtdb.firebaseio.com"
});
const db = admin.database();

app.get('/', (req: any, res: any) => {
    return res.status(200).json({ message: 'API de Indoor House' });
})
app.get('/plants', async (req: any, res: any) => {
    const plants = await db.ref().child('plants').get();
    if (plants) {
        return res.status(200).json({ plants: plants })
    } else {
        return res.status(404).json({ message: 'No se encontró ningun registro de plantas' })
    }
})
app.get('/records', async (req: any, res: any) => {
    const records = await db.ref().child('records').get();
    if (records) {
        return res.status(200).json({ records: records })
    } else {
        return res.status(404).json({ message: 'No se encontró ningun registro' })
    }
})

app.post('/records', async (req: any, res: any) => {
    const new_plant = req.params;
    if (new_plant) {
        try {
            // save to db
        } catch(e) {
            return res.status(500).json({ message: 'Error de Firebase mientras se guardaban registros en Records' })
        }
    } else {
        return res.status(400).json
    }
})

exports.app = functions.https.onRequest(app);
