#pragma once

#include <iostream>
#include "lights.hh"
#include "sensors.hh"

class HomeLightsClass
{
private:
	static const std::array<uint8_t, 11> SWITCH_PINS;

	static std::bitset<SWITCH_PINS.size()> readSwitches();

	Lights lights;
	Sensors sensors;
	std::bitset<SWITCH_PINS.size()> switchState;

public:
	void begin();
	void handle();
	void update(const Lights &lights);
	friend std::ostream &operator<<(std::ostream &os, const HomeLightsClass &dt);
};

extern HomeLightsClass HomeLights;
