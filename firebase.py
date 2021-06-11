from pyrebase import pyrebase

config = {
        "apiKey": "",
        "authDomain": "",
        "databaseURL": "",
        "projectId": "",
        "storageBucket": "",
        "messagingSenderId": "",
        "appId": "",
        "measurementId": ""
}

firebase = pyrebase.initialize_app(config)
_db = None

def get_connection():
    global _db
    if not _db:
        _db = firebase.database()
    return _db

__all__ = ['getConnection']

#lectura = db.child("humidity").get()

#print ("DB: ", lectura.val())
