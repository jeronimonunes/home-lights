export class Sensors {

	public static readonly byteSize = 8;

	private data: Float32Array;

	constructor(data: ArrayBuffer, byteOffset: number) {
		this.data = new Float32Array(data, byteOffset, 2);
	}

	get voltage() {
		return this.data[0];
	}

	get current() {
		return this.data[1];
	}

}
