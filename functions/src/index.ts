const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

const serviceCredentials = {
  "type": "service_account",
  "project_id": "indoorv2",
  "private_key_id": "d67945dadc08f53608ad630406872f68b24f565e",
  // eslint-disable-next-line
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3fNuTKYlWBKCX\nGDs6aq+1Xo4pJs6hvNr0hA96S5ImsN9pm0cA7eOMsI2kx6OJUSostGLE0C1upa+Q\nFw+dEgn1st5teomXw/3m1GdKB0b2LnAhFU+JOeqjQN4whMYmT9zP/4xB94ZaEEtw\n3xm6mwT2aD8ukMGN0I3Qo8CXoLBpfO97ga6yArLIzFwVZvoGtM+G2ezxfUJgwePE\n6QMBM/n0Dod3631CsucRMaZ7dLmY9HFNbc6FvNDStCh6IB3GEsnh+g6HlwhMcCHw\nwc7ldJ63eKpsuzVeuFMiZJjdYn6egzKvWMwinxa4xoWnAlXcrQTelqUkuCJHcG/d\nrl6XSuHTAgMBAAECggEAEnaHV6sFzTiA+kMvboTeslbV4jEr+J1awODq98jT533D\ntUoxHlhRnc4EKrEF9SLMJhxuldRGxgv4+vw/D3SJuQXrGMQMRU+s5EW6MPpDezEY\nClQtISdJQ20bDnHFyIQfuXRC5j5kb/qUxMJGQf8oRC0gMmzRdRYntvdLQVajebGz\nU+2wT38XF2zp25VgUTNzXnA2xMcVhCdso1vpMHoqsdR5dL6c9UeDiYC9Eoa1k5UE\nfAqVgd1x385vIUpx1XLAw4sFTg4Fnt0mkxfOXLvBKmQetacrlLds3T2qgaEWYZMa\nuWgWrb86XGnSyrjeKxJaaBCOgGlj3uK6h2+dOSNbiQKBgQDstjJJemaER7W3haTT\nqLS6dtvqxyK7/RTSRMw3fRMXGp9iYlBygXViww9DCqiltDuEIrtajtkw1degzprc\nI0s1o23NRWGugl0osAmh7GFZRV7VZwiv4SB30NW6aEhuV6DEyrhzMESUvDKvkZFr\nENrN7m6Q+7vh6Sa5itfh3SioCQKBgQDGcGjfH/3ofcndZP0kHNSF9Ly5ZbIwZLAL\n0lnqYe705qBgkWGZgEGelfrY3I0beLOREEICIEX8cqFK8kly8ROeovvyVYwvThdX\n4xb0/h4MPQq/Hfbz0nQ3c7MFOjU3yiLg77eAGnBl7vu2EyAFI1csu0jrCAMDvWTF\n8Tz8YKtZ+wKBgHriIrzuY+Xr7DP3lxeiDyB1r7jz494/hd2ahYGQ1qY51eAXNbgb\n6Lp6lKOzFtXe+L6h4S0j1zB48tWyK8Z4NAUGcGwNxqX3WzFSIc4Djo3va0nRkTrs\n3hQVP77jgCZ4Kye+LX7u4cts38sxAJLaTxx02MU/Scv/Y3ES2PuR+hcxAoGBAKPp\nelbD4EHIlZPwtUC9J7c2vyUNIbDjmp9JM8hs+KsGTXc23z2iOZG7JSc4lr4YZ4rt\nuPh0nBq4vQ5hL9Zn1+LzkdVMYK06fgG0rOPVfBBz44qWP8SLFEAxq7AnsonQyBqx\nKAwCytEIJJbzGUHlPT7PvJ2XUpYmPTVb3RpC54c9AoGAZiUjJ/nDIP+vgyhOSw9z\nhtytMIZ+kYewmdBcIBdyjUIy3+D7CpjdvQxHCmYj06dII7qnzXz9fi5IzKf5WhdT\n0Jh59b7M+XvdAvaYWWgVR5OnerM4cGXXjLfmGfPPSGlYcdPITXUbt3BQzrYxd9oJ\nQnrPW7/HKFvaJhJ/t2Nu7kE=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-kd9xz@indoorv2.iam.gserviceaccount.com",
  "client_id": "102746389639181900081",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kd9xz%40indoorv2.iam.gserviceaccount.com"
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

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
}

exports.indoorapi = functions.runWith(runtimeOpts).https.onRequest(app);
