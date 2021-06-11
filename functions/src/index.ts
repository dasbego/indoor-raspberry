const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');

const service_credentials = {
    "type": "service_account",
    "project_id": "indoorv2",
    "private_key_id": "5c4a4e71b3824d0327b80b605d5d86482b7e243d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDJtrFmQ008835i\nDsurBAPTYPQJkajvKdvrP5O50iCY5Bdtd+IpeC2SFuo+Q/CsJde42vaBDKpj0hZ8\ndIJfeiuHwvJlmatwNMaAcqmmdP9sicfJ/ui9eztRKG62asUXYuNU6YCpPvlyBwk8\n77cAs0g3NO8kyLBRXCBJhdwNw9MVsm33iQwleGH6tmVGxLA24oF5X56HbRCsxT0E\nbpqX6YxlKNg9fP+BqR5GysFRbVNaJVNJ26AXQAVVhAQoIouJiLJgOrh5qm/lv0LN\n+hHKPAXWAMnmEhC4l1tsmSVfosvDfeTYnBsWIV0ac7BGqWjjtlM3qWpvBC/6KfQx\n12KwHqV7AgMBAAECggEAUvRXMH8tHIvmxdzf1YzpJd0Rf33vw6urTavvzNOlpDrp\nh5Nt5zANTa8u1jyKlcFaXiNujNPwnuyfYr9nfmx3ynVZyn7QCm0p1VlSe6pSAQkI\nqQG0JXiwhEfkgBCYzW1VoG4HA5NqcoKCQhUzZY5VfJ7AWphOKqeAf7wVK3QFMz5b\nImUV06l7xRe3eKny5V2dZ9nPPy15EMqsBTOd5h05ZUKKTDeXfr6jPZYMLbw3SuHv\npzItV27XYz4GL+loLbPAJaky6UpFRXFo+35CN4oOtDEE6S5OaxwqPeeEkw7iT/p0\nGliYc/u0BmoQusLnSmgAqyYDHh3jJdFMFB1FmTmGwQKBgQDj2SZRPs/Tsa90F/aI\n4iD2jJN1vJ3bHMaiyJOZrXCYsHj/cyGfViaqoRtuy68i01nHGfIxSc9TmQfNJpp2\ncKJR+ejd1Aig8fwFd8oLE8f8H/xgVTl+HIKw7HNFefgYm6A2vHf9D2r1yz3I+Zwk\nAnil8Y7b4CFrVNK54zq7hHAplQKBgQDiouehDvAkEazuI8YQsYf+hnNW1LgH6Sru\n4mwb82jFe25tIPbPR1aqFvgZ4FDL7at1ABlC8VehOjEzwhYZ5JVlGPPG3eOgc27o\nt3VFppt96WMU5Tymu5c8mpMeyjPhmDSSBnCvf2qRib0XqKhWwygksgSJgPh9B+33\nxGD8q5NuzwKBgGXq5UPkR8xWp7fTXDjAhaQjH3bDxwyS45s/Ax7zwPDbx1PkqP5/\n583dQMsfmxiF15vC1F4NuQqY4i92/BLMsR7gHbTUOoPbmjLL8XlhAMybdiWVGaF6\nmU8QhUNnmn1PZ6v0Q+vTcLG/lsSGOry0ykjYM2HQ8MH08EmsBcKJLC69AoGAIxqG\ndBzjN0MBnRUvbZCB9vuOS+nA44DLJJsvkZi/Jq96qC6N7Acptki+fwuOmDek8gdk\n4kiNgSyJSHIMiFAuj60wvSHLSyP2Dtezs2kd9n+62Ba1sUGnKDztArzhElVH90JG\nG/jJYeeKwWpfQKkTw7NLHp06X+tlgZYKS7irqmMCgYAuek+pqOrIoYtBFg7DfNQ8\nw6MMrrg/1fj+p9dT6uj6VwCgpMaaM4xCAaPAdw5K0qTc/W2cvdEqeXLtscccEEej\n8SNQ+WwIHv4ga3KdmBTVlNbkHRpYukhUaz0TyuO0olVQwHQpde4zKe5GQ8DxiaLr\n5rWMGGEAGTG+xI3DEq2SpQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-kd9xz@indoorv2.iam.gserviceaccount.com",
    "client_id": "102746389639181900081",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kd9xz%40indoorv2.iam.gserviceaccount.com"
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
