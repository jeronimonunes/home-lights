#pragma once

#include <iostream>
#include <Arduino.h>

class Sensors
{
	static const uint8_t VSENSE_PIN = GPIO_NUM_34;
	static const uint8_t CSENSE_PIN1 = GPIO_NUM_36;
	static const uint8_t CSENSE_PIN2 = GPIO_NUM_39;

	static float constexpr voltageDivide(float vOut, float r1, float r2);
	static float readVoltage();
	static float readCurrent();

	float voltage;
	float current;

public:
	static void begin();
	void handle();
	bool operator!=(const Sensors &other);
	friend std::ostream &operator<<(std::ostream &os, const Sensors &dt);
};
