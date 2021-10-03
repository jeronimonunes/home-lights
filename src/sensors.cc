#include "sensors.hh"
#include <iomanip>
#include "moving-average.hh"

void Sensors::begin()
{
	pinMode(VSENSE_PIN, INPUT);
	pinMode(CSENSE_PIN1, INPUT);
	pinMode(CSENSE_PIN2, INPUT);
}

void Sensors::handle()
{
	this->voltage = readVoltage();
	this->current = readCurrent();
}

float constexpr Sensors::voltageDivide(float vOut, float r1, float r2)
{
	return vOut * (r1 + r2) / r2;
}

float Sensors::readVoltage()
{
	static MovingAverage<float, 500> voltage = analogReadMilliVolts(VSENSE_PIN);
	voltage = analogReadMilliVolts(VSENSE_PIN);
	return voltageDivide(voltage / 1000, 20, 2);
}

float Sensors::readCurrent()
{
	static MovingAverage<float, 500> g1 = analogReadMilliVolts(CSENSE_PIN1);
	static MovingAverage<float, 500> g2 = analogReadMilliVolts(CSENSE_PIN2);
	g1 = analogReadMilliVolts(CSENSE_PIN1);
	g2 = analogReadMilliVolts(CSENSE_PIN2);
	float vg1 = g1;
	if (vg1 > 2400)
	{
		return g2 / 1000 / 5.7 / 0.033333;
	}
	return vg1 / 1000 / 11 / 0.033333;
}

bool Sensors::operator!=(const Sensors &other)
{
	return std::abs(this->voltage - other.voltage) > 0.01 || std::abs(this->current - other.current) > 0.01;
}

std::ostream &operator<<(std::ostream &os, const Sensors &sensors)
{
	return os << std::setprecision(2) << sensors.voltage << "\t" << std::setprecision(3) << sensors.current;
}
