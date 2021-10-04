import { Bitset } from "./bitset";

export enum Light {
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

export class Lights {

	public static readonly byteSize = 16;

	public state: Bitset;
	public pwm: Uint8Array;

	constructor(public data: ArrayBuffer, byteOffset: number) {
		this.state = new Bitset(new Uint32Array(data, byteOffset, 1), 9);
		this.pwm = new Uint8Array(data, byteOffset + 4, 9);
	}

	set(light: Light, state: boolean) {
		const oldState = this.state.get(light);
		if (oldState !== state) {
			this.state.set(light, state);
			return true;
		};
		return false;
	}

	static equals(a: Lights, b: Lights): boolean {
		return Bitset.equals(a.state, b.state) && a.pwm.every((v, i) => v === b.pwm[i])
	}
}
