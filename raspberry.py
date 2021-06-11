import serial
import sys
import Adafruit_DHT
import firebase
import time
from uuid import uuid4

# Parse command line parameters.
sensor_args = { '11': Adafruit_DHT.DHT11,
                '22': Adafruit_DHT.DHT22,
                '2302': Adafruit_DHT.AM2302 }
# Serial instance for reading arduino sensors
arduino = serial.Serial("/dev/ttyACM0", baudrate=9600, timeout=5.0)
sensor = 11
pin = 4

# database connection to firebase
# This is a timeframe that defines how often to save to db. Default 10 min
db_timeframe = 1 * 5
db = firebase.get_connection()

def map (x, in_min, in_max, out_min, out_max):
    return ((x - in_min) * (out_max - out_min)) / ((in_max - in_min) + out_min)

def parseSerialStream(stream):
    # Separate plant records
    records = stream.split(sep=b'\n')
    # Separate properties
    parsedRecords = {}
    for x in records:
        decoded = x.decode('utf-8')
        if (len(decoded) > 0):
            properties = decoded.split('|');
            targetid = ''
            for prop in properties:
                if ('Target' in prop):
                    target = prop.split(':')
                    targetid = target[1].strip()
                    parsedRecords[targetid] = {
                        'name': targetid,
                    }
                if ('Humidity' in prop):
                    if (len(targetid) == 0):
                        targetid = ''
                    if (len(targetid) and parsedRecords[targetid] is not None):
                        humidity_raw = int(prop.split(':')[1].strip())
                        parsedRecords[targetid] = {
                                'humidity': {
                                    'raw': humidity_raw,
                                    'percentage': 100 - map(humidity_raw, 0, 1024, 0, 100)
                                }
                        }
    return parsedRecords

time1 = time.time()
saveToDB = False
latest_records = {}

while True:
    time2 = time.time()
    if ((time2 - time1) > db_timeframe):
        saveToDB = True
    # Try to grab a sensor reading.  Use the read_retry method which will retry up
    # to 15 times to get a sensor reading (waiting 2 seconds between each retry).
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

    # Un-comment the line below to convert the temperature to Fahrenheit.
    # temperature = temperature * 9/5.0 + 32

    # Note that sometimes you won't get a reading and
    # the results will be null (because Linux can't
    # guarantee the timing of calls to read the sensor).
    # If this happens try again!
    if humidity is not None and temperature is not None:
        dht11_record = {
            'name': 'DHT11',
            'temperature': temperature,
            'humidity': {
                'raw': humidity,
                'percentage': humidity
            }
        }
        latest_records['DHT11'] = dht11_record
        print('Temp:{0:0.1f}° | Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print('Error: Failed to get reading.')
    val = arduino.readline()
    records = parseSerialStream(val)
    if (saveToDB):
        print("Saving records to DB...", records)
        for x in latest_records:
            db.child('records').push(latest_records[x])
        saveToDB = False
        time1 = time.time()
    else:
        # update latest saved items
        for x in records:
            latest_records[x] = records[x]
    print(records)


