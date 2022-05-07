#include <Arduino.h>
#include <AsyncTCP.h>
#include <ArduinoOTA.h>
#include <ESPAsyncWebServer.h>
#include <iostream>
#include <iomanip>
#include <WiFi.h>
#include <SPIFFS.h>
#include "home-lights.hh"
#include "action.hh"

const char *ssid = "WIFI-SSID";
const char *password = "WIFI-PASSWORD";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void sendState(AsyncWebSocketClient *client)
{
	UpdateLightsAction updateLightsAction = HomeLights.lights;
	client->binary(reinterpret_cast<uint8_t *>(&updateLightsAction), sizeof(updateLightsAction));

	UpdateSensorsAction updateSensorsAction = HomeLights.sensors;
	client->binary(reinterpret_cast<uint8_t *>(&updateSensorsAction), sizeof(updateSensorsAction));

	UpdateSwitchesAction updateSwitchesAction = HomeLights.switchState;
	client->binary(reinterpret_cast<uint8_t *>(&updateSwitchesAction), sizeof(updateSwitchesAction));

	std::cout << "New client: " << client->id() << std::endl;
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
	AwsFrameInfo *info = (AwsFrameInfo *)arg;
	if (info->final && info->index == 0 && info->len == len && info->opcode == WS_BINARY && len >= sizeof(Action))
	{
		auto action = reinterpret_cast<Action *>(data);
		switch (action->type)
		{
		case ActionType::PING:
			break;
		case ActionType::UPDATE_LIGHTS:
			break;
		case ActionType::UPDATE_SENSORS:
			break;
		case ActionType::UPDATE_SWITCHS:
			break;
		case ActionType::UPDATE_LIGHT:
			if (len != sizeof(UpdateLightAction))
				break;
			auto updateLightAction = reinterpret_cast<UpdateLightAction *>(data);
			HomeLights.set(updateLightAction->light,
						   updateLightAction->state,
						   updateLightAction->pwm);
			break;
		}
	}
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
			 void *arg, uint8_t *data, size_t len)
{
	switch (type)
	{
	case WS_EVT_CONNECT:
		sendState(client);
		break;
	case WS_EVT_DISCONNECT:
		break;
	case WS_EVT_DATA:
		handleWebSocketMessage(arg, data, len);
		break;
	case WS_EVT_PONG:
	case WS_EVT_ERROR:
		break;
	}
}

void WiFiStationDisconnected(WiFiEvent_t event, WiFiEventInfo_t info)
{
	// Reconnect to WiFi on connection loss, autoreconnect from WiFi lib wasn't working
	WiFi.begin(ssid, password);
}

void notFound(AsyncWebServerRequest *request)
{
	request->send(404, "text/plain", "Not found");
}

void setup()
{
	HomeLights.begin();
	Serial.begin(115200);
	SPIFFS.begin(true);

	WiFi.mode(WIFI_STA);
	WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE);
	WiFi.onEvent(WiFiStationDisconnected, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
	WiFi.begin(ssid, password);
	WiFi.setHostname("home-lights");

	configTime(-3 * 60 * 60, 0, "pool.ntp.org");

	ws.onEvent(onEvent);
	server.addHandler(&ws);
	server.serveStatic("/", SPIFFS, "/")
		.setDefaultFile("index.html");

	server.onNotFound(notFound);
	server.begin();

	ArduinoOTA.begin();

	HomeLights.onLightUpdate = [](const Lights &lights)
	{
		UpdateLightsAction action = lights;
		ws.binaryAll(reinterpret_cast<uint8_t *>(&action), sizeof(action));
		std::cout << HomeLights << std::endl;
	};
	HomeLights.onSensorUpdate = [](const Sensors &sensors)
	{
		UpdateSensorsAction action = sensors;
		ws.binaryAll(reinterpret_cast<uint8_t *>(&action), sizeof(action));
		std::cout << HomeLights << std::endl;
	};
	HomeLights.onSwitchUpdate = [](const std::bitset<11> &switches)
	{
		UpdateSwitchesAction action = switches;
		ws.binaryAll(reinterpret_cast<uint8_t *>(&action), sizeof(action));
		std::cout << HomeLights << std::endl;
	};
}

void loop()
{
	HomeLights.handle();
	ws.cleanupClients();
	ArduinoOTA.handle();
}
