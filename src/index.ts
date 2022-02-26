export class Undoable<T = unknown> {
	#stack: T[]
	#index = 0

	capacity = 50

	constructor(initial: T, options?: { capacity: number }) {
		this.#stack = [this.validator(initial)]
		this.capacity = options?.capacity ?? this.capacity
	}

	get length(): number {
		return this.#stack.length
	}

	get(): T {
		return this.#stack[this.#index]
	}

	set(newValue: T): void {
		if (this.notEqual(this.#stack[this.#index], newValue)) {
			if (this.#stack.length > this.#index + 1) {
				this.#stack.length = this.#index + 1
			}

			this.#stack.push(this.validator(newValue))
			this.#index++

			if (this.capacity > 1 && this.#stack.length > this.capacity) {
				this.#stack.shift()
				this.#index = this.#stack.length
			}
		}
	}

	update(cb: (value: T) => T): void {
		this.set(cb(this.#stack[this.#index]))
		return
	}

	/**
	 * Method supposed to "extends"
	 * @param nowValue
	 * @param newValue
	 * @returns
	 */
	notEqual(nowValue: T, newValue: T): boolean {
		return nowValue != nowValue
			? newValue == newValue
			: nowValue !== newValue ||
					(nowValue && typeof nowValue === 'object') ||
					typeof nowValue === 'function'
	}

	/**
	 * Method supposed to "extends"
	 * @param value
	 * @returns
	 */
	validator(value: T): T {
		return value
	}

	undo(): this {
		if (this.#index > 0) {
			this.#index--
		}
		this.set(this.#stack[this.#index])
		return this
	}
	redo(): this {
		if (this.#index < this.#stack.length - 1) {
			this.#index++
		}
		this.set(this.#stack[this.#index])
		return this
	}
	canUndo(): boolean {
		return this.#index > 0
	}
	canRedo(): boolean {
		return this.#index < this.#stack.length - 1
	}
	reset(): this {
		this.#index = 0
		this.set(this.#stack[this.#index])
		return this
	}
	clear(): this {
		this.#stack = this.#stack.slice(0, 1)
		return this.reset()
	}
}
