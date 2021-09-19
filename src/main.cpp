#include <Arduino.h>
#include <AsyncTCP.h>
#include <ArduinoOTA.h>
#include <ESPAsyncWebServer.h>
#include <iostream>
#include <iomanip>
#include <WiFi.h>
#include <SPIFFS.h>
#include "home-lights.hh"

const char *ssid = "WIFI-SSID";
const char *password = "WIFI-PASSWORD";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len)
{
	AwsFrameInfo *info = (AwsFrameInfo *)arg;
	if (info->final && info->index == 0 && info->len == len && info->opcode == WS_BINARY && len == sizeof(Lights))
	{
		auto lightState = reinterpret_cast<Lights *>(data);
		HomeLights.update(*lightState);
	}
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type,
			void *arg, uint8_t *data, size_t len)
{
	switch (type)
	{
	case WS_EVT_CONNECT:
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

void setup()
{
	HomeLights.begin();
	Serial.begin(115200);
	SPIFFS.begin(true);

	WiFi.mode(WIFI_STA);
	WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE);
	WiFi.onEvent(WiFiStationDisconnected, SYSTEM_EVENT_STA_DISCONNECTED);
	WiFi.begin(ssid, password);
	WiFi.setHostname("home-lights");

	configTime(-3 * 60 * 60, 0, "pool.ntp.org");

	ws.onEvent(onEvent);
	server.addHandler(&ws);
	server.serveStatic("/", SPIFFS, "/");

	server.begin();

	ArduinoOTA.begin();

	// TODO HomeLights.onUpdate();
}

void loop()
{
	HomeLights.handle();
	ws.cleanupClients();
	ArduinoOTA.handle();

	static auto lastTime = millis();
	if ((millis() - lastTime) > 1000)
	{
		lastTime = millis();
		ws.binaryAll(reinterpret_cast<uint8_t *>(&HomeLights), sizeof(HomeLights));
		std::cout << HomeLights << std::endl;
	}
}
