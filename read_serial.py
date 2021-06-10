import serial
import sys
import Adafruit_DHT
import firebase

# Parse command line parameters.
sensor_args = { '11': Adafruit_DHT.DHT11,
                '22': Adafruit_DHT.DHT22,
                '2302': Adafruit_DHT.AM2302 }
# Serial instance for reading arduino sensors
arduino = serial.Serial("/dev/ttyACM0", baudrate=9600, timeout=5.0)
sensor = 11
pin = 4

# database connection to firebase
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
                    parsedRecords[targetid] = target
                if ('Humidity' in prop):
                    if (len(targetid) and parsedRecords[targetid] is not None):
                        humidity_raw = int(prop.split(':')[1].strip())
                        # Setting the lower limit as 200 since sensors seem to be a bit desajustados
                        parsedRecords[targetid] = {
                                'humidity': {
                                    'raw': humidity_raw,
                                    'percentage': 100 - map(humidity_raw, 0, 1024, 0, 100)
                                }
                        }

    return parsedRecords


while True:
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
        print('Temp={0:0.1f}*  Humidity={1:0.1f}%'.format(temperature, humidity))
    else:
        print('Error: Failed to get reading.')
    val = arduino.readline()
    records = parseSerialStream(val)
    print(records)


