#pragma once

#include <Arduino.h>
#include <array>
#include <bitset>
#include <iostream>

enum class Light : uint8_t
{
	ONE,
	TWO,
	THREE,
	FOUR,
	FIVE,
	SIX,
	SEVEN,
	EIGHT,
	NINE
};

class Lights
{
public:
	static const std::array<uint8_t, 9> LIGHT_PINS;

	static constexpr double FREQUENCY = 5000;
	static const uint8_t RESOLUTION_BITS = 6;
	static constexpr uint8_t MAX_PWM_VALUE = (1 << RESOLUTION_BITS) - 1;

private:
	std::bitset<LIGHT_PINS.size()> state;
	std::array<uint8_t, LIGHT_PINS.size()> pwm;

public:
	/**
	* pin configuration, run once
	*/
	static void begin();

	/**
	* Copy the state of the given object
	* Will turn on or off lights accordingly
	*/
	Lights &operator=(const Lights &other);

	/**
	* Change the state of a particular light
	* @param light the light to switch the state
	* @param state true to turn ON the light or false to turn OFF
	* @returns true if a change have occurred
	*/
	bool set(Light light, bool state = true);

	friend std::ostream &operator<<(std::ostream &, const Lights &);
};
