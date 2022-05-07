export class Bitset {

  public static readonly byteSize = 4;
  data: Uint32Array;

  constructor(
    buffer: ArrayBuffer,
    byteOffset: number,
    public readonly size: number
  ) { this.data = new Uint32Array(buffer, byteOffset, 1); }

  static equals(a: Bitset, b: Bitset) {
    return a.data[0] === b.data[0];
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.size; i++) {
      yield this.get(i);
    }
  }

  get(idx: number) {
    return !!(this.data[0] & (1 << idx));
  }

  set(idx: number, value: boolean) {
    let bit = 1 << idx;
    if (value)
      return this.data[0] |= bit; // set
    return this.data[0] &= ~bit; // clear
  }

  update(state: boolean[]) {
    let changed = false;
    for (let i = 0; i < state.length && this.size; i++) {
      if (this.get(i) !== state[i]) {
        changed = true;
        this.set(i, state[i]);
      }
    }
    return changed;
  }
}
