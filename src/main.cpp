#include <Arduino.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <EEPROM.h>
#include <IRutils.h>
#include <IRsend.h>
#include <ir_Gree.h>
#include <stdint.h>
#include <WiFi.h>

// WiFi config
const char* ssid = "user";
const char* password = "password";

// Gree config
#define IR_PIN 2          // IR on D2(GPIO4)
#define CMD_DELAY 1500    // 1.5s delay between repeats
#define CMD_REPEAT 3      // repeat comand x times
#define CMD_PARAMS 10     // params sent to AC

// Init
IRGreeAC ac(IR_PIN);
AsyncWebServer server(80);

// Validate state contains correct values
// Replace with default otherwise
// [mode(1), temp(24), fan_speed(0), flap_auto_flag(1), flap(1), light(1), turbo(0), xfan(0), sleep(0), on_off(1)]
uint8_t state[10];
void validate_state() {
  uint8_t options = 1;
  for (uint8_t j = 5; j < CMD_PARAMS; j++) {
    if (state[j] < 0 || state[j] > 1) {
      options = 0;
      break;
    }
  }

  uint8_t mode = (state[0] < 0 || state[0] > 4) ? 0 : 1;
  uint8_t temp = (state[1] < 16 || state[1] > 31) ? 0 : 1;
  uint8_t fan_speed = (state[2] < 0 || state[2] > 3) ? 0 : 1;
  uint8_t flap_auto_flag = (state[3] < 0 || state[3] > 1) ? 0 : 1;
  uint8_t flap = (state[4] < 1 || state[4] > 11) ? 0 : 1;
  
  if (!(mode && temp && fan_speed && flap_auto_flag && flap && options)) {
    Serial.println("Resetting values to default.");
    state[0] = 0;
    state[1] = 24;
    state[2] = 0;
    state[3] = 1;
    state[4] = 1;
    state[5] = 1;
    state[6] = 0;
    state[7] = 0;
    state[8] = 0;
    state[9] = 0;

    EEPROM.put(0, state);
    EEPROM.commit();
  }
  
}

void notFound(AsyncWebServerRequest *request) {
  request->send(404, "text/plain", "404-not-found");
}

String getAcDetails() {
  String response = "[";
  for (int i = 0; i < CMD_PARAMS; i++) {
    char *current = (char *)malloc(sizeof(char) * 4);
    snprintf(current, sizeof(char) * 3, "%d", state[i]);
    
    response += current;
    if (i < 9) { response += ","; }
    free(current);
  }
  response += "]";

  return response;
}

String setAcDetails(String command) {
  char tochar[command.length() + 1];
  command.toCharArray(tochar, command.length() + 1);

  char *current_int = strtok(tochar, ",");
  int command_index = 0;
  uint16_t command_received[CMD_PARAMS];

  while (current_int != NULL && command_index < CMD_PARAMS) {
    command_received[command_index++] = atoi(current_int);
    current_int = strtok(NULL, ",");
  }

  // Run only if we turning on the AC
  if (command_received[9] == 1) {
    ac.setMode(command_received[0]);
    ac.setTemp(command_received[1]);
    ac.setFan(command_received[2]);
    ac.setSwingVertical(command_received[3], command_received[4]);
    ac.setLight(command_received[5]);
    ac.setTurbo(command_received[6]);
    ac.setXFan(command_received[7]);
    ac.setSleep(command_received[8]);

    // Save params if we are not turning off
    for (int h = 0; h < CMD_PARAMS - 1; h++) {
      state[h] = command_received[h];
    }
  }
  ac.setPower(command_received[9]);

  // Save in state last power command
  state[9] = command_received[9];

  // Send IR signal to AC
  int send_cmd_repeat = 0;
  while (send_cmd_repeat < CMD_REPEAT) {
    ac.send();
    delay(CMD_DELAY);
    send_cmd_repeat++;
  }

  // Save to memory
  EEPROM.put(0, state);
  EEPROM.commit();

  // Return
  return "success";
}

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
    return;
  }

  // Read EEPROM data
  EEPROM.begin(CMD_PARAMS * sizeof(uint8_t));
  EEPROM.get(0, state);
  validate_state();

  // IR set last known state
  ac.begin();
  ac.setMode(state[0]);
  ac.setTemp(state[1]);
  ac.setFan(state[2]);
  ac.setSwingVertical(state[3], state[4]);
  ac.setLight(state[5]);
  ac.setTurbo(state[6]);
  ac.setXFan(state[7]);
  ac.setSleep(state[8]);
  ac.setPower(state[9]);

  // Handle index
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", "success");
  });

  // Handle get details request
  server.on("/get-ac", HTTP_GET, [] (AsyncWebServerRequest *request) {
    request->send(200, "text/plain", getAcDetails());
  });

  // Handle set details request
  server.on("/post-ac", HTTP_POST, [](AsyncWebServerRequest *request){
    String command;
    if (request->hasParam("command", true)) {
      command = request->getParam("command", true)->value();
    } else {
      command = "[1,24,0,1,1,1,0,0,0,1]";
    }
    request->send(200, "text/plain", setAcDetails(command));
  });

  server.onNotFound(notFound);
  server.begin();
}

void loop() {
}