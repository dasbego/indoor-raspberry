#Indoor Plant project

The project contains 3 components:
1) Sensor reader:
	Python script to be run in the Raspberry. This script makes use of:
	- DHT11 temperature & humidity sensor
	- Arduino Uno: Which is providing analogic data from 2x YL-69 soild humidity sensors
	This can be extended to support other digital sensors only.
2) API: A Flask API that makes use of Firebase Databases to manage:
	- Plants CRUD: add new plants to the indoor house
	- Plants records: adding new records from plants information containing humidity in each plant. And fetching of plant specific records
3) Arduino program:
	Allows to configure both digital and analogic sensors and send them via serial to the raspberry.
	It currently reads 2x YL-69 sensors that are connected to 2 different pots in the indoor house.
