#include <lights.hh>

// RM at hardware schematics
const std::array<uint8_t, 9> Lights::LIGHT_PINS = {
	GPIO_NUM_32,
	GPIO_NUM_25,
	GPIO_NUM_27,
	GPIO_NUM_33,
	GPIO_NUM_26,
	GPIO_NUM_14,
	GPIO_NUM_13,
	GPIO_NUM_23,
	GPIO_NUM_22,
};

void Lights::begin()
{
	for (uint8_t i = 0; i < LIGHT_PINS.size(); i++)
	{
		auto gpio = LIGHT_PINS[i];
		pinMode(gpio, OUTPUT);
		ledcSetup(i, FREQUENCY, RESOLUTION_BITS);
		ledcAttachPin(gpio, i);
		ledcWrite(i, 0);
	}
}

bool Lights::set(Light light, bool state, uint8_t pwm)
{
	auto changed = false;
	auto idx = static_cast<uint8_t>(light);
	if (state && pwm == 0)
	{
		pwm = MAX_PWM_VALUE;
	}
	if (this->state[idx] != state)
	{
		this->state[idx] = state;
		changed = true;
	}
	if (this->pwm[idx] != pwm)
	{
		this->pwm[idx] = pwm;
		changed = true;
	}
	if (changed)
	{
		ledcWrite(idx, state ? pwm : 0);
	}
	return changed;
}

bool Lights::operator!=(const Lights &other)
{
	return this->state != other.state || this->pwm != other.pwm;
}

std::ostream &operator<<(std::ostream &os, const Lights &dt)
{
	auto pwmIt = dt.pwm.begin();
	os << (dt.state[0] ? "\x1B[32m" : "\x1B[31m");
	os << unsigned(*pwmIt);
	pwmIt++;
	while (pwmIt < dt.pwm.end())
	{
		os << ", ";
		os << (dt.state[pwmIt - dt.pwm.begin()] ? "\x1B[32m" : "\x1B[31m");
		os << unsigned(*pwmIt);
		pwmIt++;
	}
	return os << "\x1B[0m";
}
