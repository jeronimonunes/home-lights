#pragma once

#include <iostream>
#include <functional>
#include "lights.hh"
#include "sensors.hh"

class HomeLightsClass
{
private:
	static const std::array<uint8_t, 11> SWITCH_PINS;

	static std::bitset<SWITCH_PINS.size()> readSwitches();

public:
	Lights lights;
	Sensors sensors;
	std::bitset<SWITCH_PINS.size()> switchState;

	std::function<void(const Lights &)> onLightUpdate;
	std::function<void(const Sensors &)> onSensorUpdate;
	std::function<void(const std::bitset<SWITCH_PINS.size()> &)> onSwitchUpdate;

public:
	void begin();
	void handle();
	void set(Light light, bool state, uint8_t pwm);
	bool operator!=(const HomeLightsClass &other);
	friend std::ostream &operator<<(std::ostream &os, const HomeLightsClass &dt);
};

extern HomeLightsClass HomeLights;
