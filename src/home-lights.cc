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
	static Sensors lastSensors;
	static auto lastSensorTime = millis();
	auto elapsed = millis() - lastSensorTime;

	this->sensors.handle();
	if (elapsed > 100 && this->sensors != lastSensors && this->onSensorUpdate)
	{
		lastSensorTime = millis();
		lastSensors = this->sensors;
		this->onSensorUpdate(lastSensors);
	}

	bool switchChanged = false;
	for (uint8_t i = 0; i < SWITCH_PINS.size(); i++)
	{
		auto gpio = SWITCH_PINS[i];
		bool newValue = digitalRead(gpio);
		auto oldValue = this->switchState[i];
		if (newValue != oldValue)
		{
			switchChanged = true;
			oldValue = newValue;
		}
	}
	if (switchChanged && this->onSwitchUpdate)
	{
		this->onSwitchUpdate(this->switchState);
	}
}

void HomeLightsClass::set(Light light, bool state, uint8_t pwm)
{
	auto changed = this->lights.set(light, state, pwm);
	if (changed && this->onLightUpdate)
	{
		this->onLightUpdate(this->lights);
	}
}

bool HomeLightsClass::operator!=(const HomeLightsClass &other)
{
	return this->lights != other.lights || this->sensors != other.sensors || this->switchState != other.switchState;
}

std::ostream &operator<<(std::ostream &os, const HomeLightsClass &dt)
{
	return os << dt.sensors << "\t" << dt.lights << "\t" << dt.switchState;
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
