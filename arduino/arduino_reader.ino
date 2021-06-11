/*
 
 All the resources for this project:
 https://randomnerdtutorials.com/
 
*/

/*
 # Example code for the moisture sensor
 # Connect the sensor to the A0 (Analog 0) pin on the Arduino board
 # the sensor value description
 # 0 ~300 dry soil
 # 300~700 humid soil
 # 700~950 in water
*/ 

int tl36_plant1 = A0;
int tl36_plant2 = A1;

void setup(){
  pinMode(tl36_plant1, INPUT);
  pinMode(tl36_plant2, INPUT);
  Serial.begin(9600);
}


void loop() {
  // read the input on analog pin 0:
  int plant1_analog = analogRead(tl36_plant1);
  int plant2_analog = analogRead(tl36_plant2);
  
  // Check plant 1 humidity
  Serial.print("Target: Planta 1");
  Serial.print(" | Humidity: ");
  Serial.println(plant1_analog);
  
  // Check plant 2 humidity
  Serial.print("Target: Planta 2");
  Serial.print(" | Humidity: ");
  Serial.println(plant2_analog);
  delay(5000);
}
