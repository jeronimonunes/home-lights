import { Bitset } from "./bitset";
import { Light, Lights } from "./lights";
import { Sensors } from "./sensors";

export enum ActionType {
	PING,
	UPDATE_LIGHT,
	UPDATE_LIGHTS,
	UPDATE_SENSORS,
	UPDATE_SWITCHS,
}

export class Action {

	public static readonly byteSize = 4;

	public view: DataView;

	get type() {
		return this.view.getUint32(0, true);
	}

	set type(type: number) {
		this.view.setUint32(0, type, true);
	}

	constructor(data: ArrayBuffer | ArrayBufferView) {
		const buffer = ArrayBuffer.isView(data) ? data.buffer : data;
		this.view = new DataView(buffer);
	};

	static fromData(data: ArrayBuffer) {
		const type = new DataView(data).getUint32(0, true) as ActionType;
		switch (type) {
			case ActionType.PING:
				return PingAction.INSTANCE;
			case ActionType.UPDATE_LIGHT:
				return new UpdateLightAction(data);
			case ActionType.UPDATE_LIGHTS:
				return new UpdateLightsAction(data);
			case ActionType.UPDATE_SENSORS:
				return new UpdateSensorsAction(data);
			case ActionType.UPDATE_SWITCHS:
				return new UpdateSwitchesAction(data);
		}
	}
}

export class PingAction extends Action {

	public static readonly INSTANCE = new PingAction();

	private constructor() {
		super(new Uint32Array([ActionType.PING]));
	}

}

export class UpdateLightAction extends Action {

	constructor(data: ArrayBuffer);
	constructor(light: Light, state: boolean, pwm: number);

	constructor(light: Light | ArrayBuffer, state?: boolean, pwm?: number) {
		if (typeof light !== 'number') {
			super(light);
		} else {
			super(new Uint8Array([ActionType.UPDATE_LIGHT, 0, 0, 0, light!, state! ? 1 : 0, pwm!, 0]));
		}
	}

	get light(): Light {
		return this.view.getUint8(4);
	}

	get state(): boolean {
		return !!this.view.getUint8(5);
	}

	get pwm(): number {
		return this.view.getUint8(6);
	}

}

export class UpdateLightsAction extends Action {

	lights: Lights;
	constructor(buffer = new ArrayBuffer(Action.byteSize + Lights.byteSize)) {
		super(buffer);
		this.type = ActionType.UPDATE_LIGHTS;
		this.lights = new Lights(this.view.buffer, Action.byteSize);
	}

};

export class UpdateSensorsAction extends Action {

	sensors: Sensors;
	constructor(buffer = new ArrayBuffer(Action.byteSize + Sensors.byteSize)) {
		super(buffer);
		this.type = ActionType.UPDATE_SENSORS;
		this.sensors = new Sensors(this.view.buffer, Action.byteSize);
	}

};

export class UpdateSwitchesAction extends Action {

	switches: Bitset;
	constructor(buffer = new ArrayBuffer(Action.byteSize + Bitset.byteSize)) {
		super(buffer);
		this.type = ActionType.UPDATE_SENSORS;
		this.switches = new Bitset(new Uint32Array(this.view.buffer, Action.byteSize, 1), 11);
	}

};
