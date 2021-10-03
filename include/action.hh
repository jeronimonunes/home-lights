#pragma once
#include "home-lights.hh"

enum class ActionType : uint32_t
{
	PING,
	UPDATE_LIGHT,
	UPDATE_LIGHTS,
	UPDATE_SENSORS,
	UPDATE_SWITCHS,
};

struct Action
{
	ActionType type;
	Action(ActionType type) : type(type) {}
};

struct PingAction : public Action
{
	PingAction() : Action(ActionType::PING) {}
};

struct UpdateLightAction : public Action
{
	Light light;
	bool state;
	uint8_t pwm;
	UpdateLightAction() : Action(ActionType::UPDATE_LIGHT) {}
};

struct UpdateLightsAction : public Action
{
	Lights lights;
	UpdateLightsAction() : Action(ActionType::UPDATE_LIGHTS) {}
	UpdateLightsAction(const Lights &lights)
		: Action(ActionType::UPDATE_LIGHTS),
		  lights(lights) {}
};

struct UpdateSensorsAction : public Action
{
	Sensors sensors;
	UpdateSensorsAction() : Action(ActionType::UPDATE_SENSORS) {}
	UpdateSensorsAction(const Sensors &sensors)
		: Action(ActionType::UPDATE_SENSORS),
		  sensors(sensors) {}
};

struct UpdateSwitchesAction : public Action
{
	std::bitset<11> switchState;
	UpdateSwitchesAction() : Action(ActionType::UPDATE_SWITCHS) {}
	UpdateSwitchesAction(const std::bitset<11> &switchState)
		: Action(ActionType::UPDATE_SWITCHS),
		  switchState(switchState) {}
};
