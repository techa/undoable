# Undoable
> zero-dependency simple undoable class

	npm install git+ssh://git@github.com:/techa/undoable

```
"dependencies": {
	"undoable": "git://github.com/techa/undoable.git"
}
```

```ts
const actions = ['Initial state']

class ExUndoable<T> extends Undoable {
	onCapacityOver(): void {
		actions.shift()
	}
	set(value: T, action?: string): boolean {
		if (!action) {
			throw new Error(`(${action}): action is invalid`)
		}
		const bool = super.set(value)
		if (bool) {
			actions.push(action)
		}
		return bool
	}
}
```
