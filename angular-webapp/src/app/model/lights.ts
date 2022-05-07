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
  private static readonly NUMBER_OF_LIGHTS = 9;

  public state: Bitset;
  public pwm: Uint8Array;

  constructor(public data: ArrayBuffer, byteOffset: number) {
    this.state = new Bitset(data, byteOffset, Lights.NUMBER_OF_LIGHTS);
    this.pwm = new Uint8Array(data, byteOffset + Bitset.byteSize, Lights.NUMBER_OF_LIGHTS);
  }

  /**
   * Set the state of a given light
   * @param light The light to change value
   * @param state If the light should be on or off
   * @returns If the state have been changed (if it was different from the given one)
   */
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
