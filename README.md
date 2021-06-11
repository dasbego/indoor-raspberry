# Indoor Plant project

This is an indoor plant tent project that aims to monitor and control (in the future) hardware assets in the tent configuration.
The scope for now has been to integrate sensors to keep track of the environment and capture data for future possible web and mobile clients.

The raspberry concentrates the data from the sensors attached to it and the Arduino captured data and sends it to a Firebase database by using Firebase Functions. There is also a solution to expose a Python API instead of the Firebase Functions, also included here. The usage of Firebase makes the data available all the time as it live in the cloud and it doesn't depend on the Raspberry to be always turned on.

The project contains the following components:

1. Sensor reader:
   Python script to be run in the Raspberry. This script makes use of:
   - DHT11 temperature & humidity sensor
   - Arduino Uno: Which is providing analogic data from 2x YL-69 soild humidity sensors
     This can be extended to support other digital sensors only.
2. Flask API: `./api.py`
   A Flask API that makes use of Firebase Databases to manage:
   - Plants CRUD: add new plants to the indoor house
   - Plants records: adding new records from plants information containing humidity in each plant. And fetching of plant specific records
3. Arduino program: `/arduino`
   Added to this repository to maintain the whole solution code in one place. This is meant to run in the Arduino Uno.
   Allows to configure both digital and analogic sensors and send them via serial to the raspberry.
   It currently reads 2x YL-69 sensors that are connected to 2 different pots in the indoor house.
4. Firebase functions: `/functions`
   It is a Node.js project by itself. Created by default when using `$ firebase init`
   Same functionality as API but rewritten with NodeJS in order to deploy the functions to firebase, making the API available on the cloud instead of depending on the Raspberry to be always turned on. This makes data available to every web and mobile applications we may have.

## Requirements

### Hardware

- Raspberry Pi 3+
- Arduino Uno
- 1x USB Serial cable (commonly included with the Ardiono Uno board)
- 2x YL-36 Soil humidity sensors
- 1x DHT11 Temperature and humidity sensor
- 1x Protoboard

### Software

- Firebase Toolkit: CLI, firebase-tools
- Python3 - For Raspberry sensors reader and running the Flask API
- NodeJS 12 LTS - Node 14 LTS is not supported for Raspbian
- Arduino IDE - Load the \*.ino files to the Arduino Uno

## Setup

### Recommendations

1. Create a Firebase account and a project.
   Setup the Firebase database and configure this project to work with it. You can change this config at two different places dependin on the API solution you choose:
   - Firebase Functions: `functions/src/index.ts`
   - Python API: `firebase.py`
2. Test the whole setup with a keyboard, mouse and Monitor attached to the Raspberry before moving it inside the tent and make sure it works with all the components integrated (hardware, software and cloud software)

Extra) Setup the raspberry to be accessed through SSH. This way you can work with it remotely.

### Raspberry and Arduino Setup

_IMPORTANT_: The whole configuration must be done before connecting the Raspberry to the electrical outlet.

1. Connect the DHT11 sensor directly to the Raspberry Pi. (Default to Pin 4)
   Make sure to change the corresponding pin number in the Raspberry program (`raspberry.py`) so it correctly retrieves the data from the pin you preferred.
2. Connect the serial USB cable to one of its USB entries.
   Default to lower left USB socket, where in the Raspberry it is recognized as `/dev/ttyACM0` (most commonly).
   This should also match the USB connected port as name may change.
   To check which port you're using run the following: `$ ls /dev/tty*` both when attached and not attached to the Arduino Uno.
3. Connect the YL-36 sensors to the Arduino Uno.
   Default to Analogic 1 and Analogic 2 pins respectively.
   If you wish to change this just make sure to change in `/arduino/arduino_reader.ino` file.
4. Connect the Ardiuno Uno to the Raspberry with the Serial USB cable. This will charge the Arduino.
5. Connect the Raspberry to the electrical outlet.
