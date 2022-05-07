import { Bitset } from "./bitset";
import { Lights } from "./lights";
import { Sensors } from "./sensors";

export class HomeLights {

  public static readonly byteSize = 28;
  private static readonly NUMBER_OF_SWITCHES = 11;

  lights: Lights;
  sensors: Sensors;
  switchState: Bitset;

  constructor(public data = new ArrayBuffer(HomeLights.byteSize), public byteOffset = 0) {
    this.lights = new Lights(data, byteOffset);
    this.sensors = new Sensors(data, byteOffset + Lights.byteSize);
    this.switchState = new Bitset(data, byteOffset + Lights.byteSize + Sensors.byteSize, HomeLights.NUMBER_OF_SWITCHES);
  }

  static equals(a: HomeLights, b: HomeLights): boolean {
    let aa = new Uint32Array(a.data);
    let bb = new Uint32Array(b.data);
    return aa.every((v, i) => v === bb[i]);
  }

}
