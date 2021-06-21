from pyrebase import pyrebase

config = {
        "apiKey": "AIzaSyCdQYPC9Fs0vjSjdKooV--0tGy1LXx_FMk",
        "authDomain": "indoorv2.firebaseapp.com",
        "databaseURL": "https://indoorv2-default-rtdb.firebaseio.com/",
        "projectId": "indoorv2",
        "storageBucket": "indoorv2.appspot.com",
        "messagingSenderId": "1011981380532",
        "appId": "1:1011981380532:web:88f3ba98d241a2116f20e1",
        "measurementId": "G-4YWH4SFYGY"
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
