export interface UndoableOptions {
	capacity?: number
}

export class Undoable<T = unknown> {
	#stack: string[]
	#index = 0

	capacity = 50

	constructor(initial: T, options?: UndoableOptions) {
		this.#stack = [this.validator(initial)]
		this.capacity = options?.capacity ?? this.capacity
	}

	get length(): number {
		return this.#stack.length
	}

	get(): T {
		return JSON.parse(this.#stack[this.#index])
	}

	/**
	 * @param newValue
	 * @returns Succeed in adding it?
	 */
	set(newValue: T): boolean {
		const newVal = this.validator(newValue)
		const notEqual = this.#stack[this.#index] !== newVal
		if (notEqual) {
			if (this.#stack.length > this.#index + 1) {
				this.#stack.length = this.#index + 1
			}

			this.#stack.push(newVal)
			this.#index++

			if (this.capacity > 1 && this.#stack.length > this.capacity) {
				this.#stack.shift()
				this.#index = this.#stack.length - 1
			}

			this.onUpdate()
		}
		return notEqual
	}

	update(cb: (value: T) => T): boolean {
		return this.set(cb(this.get()))
	}

	/**
	 * extend methd
	 */
	onUpdate() {}

	/**
	 * Method supposed to "extends"
	 * @param value
	 * @returns
	 * @used constructor() .set() .clear()
	 */
	validator(value: T): string {
		if (typeof value === 'string') {
			return value
		}
		return JSON.stringify(value)
	}

	jump(index: number): boolean {
		if (
			Number.isInteger(index) &&
			this.#index !== index &&
			index < this.#stack.length
		) {
			this.#index = index
			return true
		}
		return false
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
		this.set(this.get())
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
