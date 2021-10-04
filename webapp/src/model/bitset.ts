export class Bitset {

	public static readonly byteSize = 4;

	constructor(
		private data: Uint32Array,
		public readonly size: number
	) { }

	static equals(a: Bitset, b: Bitset) {
		return a.data[0] === b.data[0];
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
