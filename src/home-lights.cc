#include "home-lights.hh"

HomeLightsClass HomeLights;

void HomeLightsClass::begin()
{
	Lights::begin();
	Sensors::begin();

	for (auto gpio : SWITCH_PINS)
	{
		pinMode(gpio, INPUT_PULLUP);
	}
}

void HomeLightsClass::handle()
{
	sensors.handle();

	for (uint8_t i = 0; i < SWITCH_PINS.size(); i++)
	{
		auto gpio = SWITCH_PINS[i];
		this->switchState[i] = digitalRead(gpio);
	}
}

std::ostream &operator<<(std::ostream &os, const HomeLightsClass &dt)
{
	return os << dt.sensors << "\t" << dt.lights << "\t" << dt.switchState;
}

void HomeLightsClass::update(const Lights &lights)
{
	this->lights = lights;
}

// SW at hardware schematics
const std::array<uint8_t, 11> HomeLightsClass::SWITCH_PINS = {
	GPIO_NUM_21,
	GPIO_NUM_18,
	GPIO_NUM_17,
	GPIO_NUM_4,
	GPIO_NUM_2,
	GPIO_NUM_15,
	GPIO_NUM_16,
	GPIO_NUM_5,
	GPIO_NUM_19,
	GPIO_NUM_12,
	GPIO_NUM_35,
};
