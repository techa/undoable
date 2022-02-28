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

	/**
	 * @param newValue
	 * @returns Succeed in adding it?
	 */
	set(newValue: T): boolean {
		const notEqual = this.notEqual(this.#stack[this.#index], newValue)
		if (notEqual) {
			if (this.#stack.length > this.#index + 1) {
				this.#stack.length = this.#index + 1
			}

			this.#stack.push(this.validator(newValue))
			this.#index++

			this.onUpdate()

			if (this.capacity > 1 && this.#stack.length > this.capacity) {
				this.#stack.shift()
				this.#index = this.#stack.length
			}
		}
		return notEqual
	}

	update(cb: (value: T) => T): boolean {
		return this.set(cb(this.#stack[this.#index]))
	}

	/**
	 * extend methd
	 */
	 onUpdate() {}

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
	 * @ constructor() .set() .clear()
	 */
	validator(value: T): T {
		return value
	}

	undo(): boolean {
		if (this.#index > 0) {
			this.#index--
			return true
		}
		return false
	}
	redo(): boolean {
		if (this.#index < this.#stack.length - 1) {
			this.#index++
			return true
		}
		return false
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
		this.#index = 0
		return this
	}
	clear(value?: T): this {
		this.#stack = [
			value === undefined
				? this.#stack[this.#index]
				: this.validator(value),
		]
		this.#index = 0
		return this
	}
}
