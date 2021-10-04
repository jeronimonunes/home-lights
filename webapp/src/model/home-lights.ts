import { Bitset } from "./bitset";
import { Lights } from "./lights";
import { Sensors } from "./sensors";

export class HomeLights {

	static readonly byteSize = 28;

	lights: Lights;
	sensors: Sensors;
	switchState: Bitset;

	constructor(public data = new ArrayBuffer(HomeLights.byteSize), public byteOffset = 0) {
		this.lights = new Lights(data, byteOffset);
		this.sensors = new Sensors(data, byteOffset + 16);
		this.switchState = new Bitset(new Uint32Array(data, byteOffset + 24, 1), 11);
	}

	static equals(a: HomeLights, b: HomeLights): boolean {
		let aa = new Uint32Array(a.data);
		let bb = new Uint32Array(b.data);
		return aa.every((v, i) => v === bb[i]);
	}

}
