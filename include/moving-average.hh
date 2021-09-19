#pragma once

#include <array>

/**
 * Stores <Size> values of <Type> to get their average
 * Every assignment to this class adds a value to the averge
 * and makes the older values get lost
 * Every cast of this class to its original Type will compute
 * the averge and return it
 */
template <typename Type, size_t Size>
class MovingAverage
{

private:
	std::array<Type, Size> values;
	size_t idx = 0;

public:
	constexpr size_t size()
	{
		return Size;
	}

	MovingAverage(Type initial)
	{
		this->values.fill(initial);
	}

	MovingAverage<Type, Size> &operator=(const Type &v)
	{
		idx %= values.size();
		values[idx] = v;
		idx++;
		return *this;
	}

	operator Type() const
	{
		Type val = 0;
		for (auto v : values)
		{
			val += v;
		}
		return val /= values.size();
	}
};
