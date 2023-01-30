import test from 'ava'
import { Undoable } from './index.js'
// import { Undoable } from '../dist/index.js'

test(`Undoable.canUndo`, (t) => {
	const val = new Undoable(0)
	t.is(val.canUndo(), false)
	val.set(1)
	t.is(val.canUndo(), true)
	val.undo()
	val.undo()
	t.is(val.canUndo(), false)
})
test(`Undoable.undo`, (t) => {
	const val = new Undoable(0)
	val.set(1)
	val.undo()
	t.is(val.get(), 0)
})

test(`Undoable.canRedo`, (t) => {
	const val = new Undoable(0)
	val.set(1)
	val.set(2)
	val.set(3)
	t.is(val.canRedo(), false)
	val.set(4)
	val.undo()
	t.is(val.canRedo(), true)
})
test(`Undoable.redo`, (t) => {
	const val = new Undoable(0)
	val.set(1)
	val.set(2)
	t.is(val.update((val) => val + 0), false)
	val.set(3)
	val.set(4)
	val.undo()
	val.undo()
	val.redo()
	t.is(val.get(), 3)
})

test(`Undoable.length`, (t) => {
	const val = new Undoable(0)
	val.set(1)
	val.set(1)
	val.set(1)
	val.undo()
	t.is(val.length, 2)
})

test(`Undoable.update`, (t) => {
	const val = new Undoable([1, 2, 3, 4])
	t.is(
		val.update((arr) => arr),
		false,
	)
	t.deepEqual(val.get(), [1, 2, 3, 4])
	val.update((arr) => [...arr.map((v) => v + 1)])
	t.deepEqual(val.get(), [2, 3, 4, 5])
	t.is(val.undo(), true)
	t.deepEqual(val.get(), [1, 2, 3, 4])
})

test(`ExUndoable.validator`, (t) => {
	class ExUndoable extends Undoable {
		validator(value) {
			return value + ''
		}
	}
	const val = new ExUndoable(0)
	val.set(1)
	val.set(2)
	val.set(3)
	val.set(4)
	val.undo()
	val.undo()
	val.redo()
	t.is(val.get(), 3)
})

test(`Undoable`, (t) => {
	const val = new Undoable<{}[]>([{ x: 0, y: 0 }])
	t.is(val.set([]), true)
	t.is(val.canUndo(), true)

	t.is(val.set([{ x: 0, y: 0 }]), true)
	t.is(val.canUndo(), true)

	t.is(val.set([{ y: 0, x: 0 }]), true)
	t.is(val.canUndo(), true)

	t.is(val.set([{ x: 0, y: 0, z: 8 }]), true)
	t.is(val.set([{ x: 0 }]), true)
	t.is(val.set([{ y: 0 }]), true)
	t.is(val.length, 7)
	t.is(val.canUndo(), true)
	t.is(val.undo(), true) //x: 0
	t.is(val.undo(), true) //x: 0, y: 0, z: 8
	t.is(val.redo(), true) //x: 0
	t.is(val.undo(), true) //x: 0, y: 0, z: 8
	t.deepEqual(val.get(), [{ x: 0, y: 0, z: 8 }])
})

test(`Undoable.reset`, (t) => {
	const val = new Undoable(0)
	val.set(1)
	val.set(2)
	val.set(3)
	val.set(4)
	val.reset()
	t.is(val.canUndo(), false)
	t.is(val.canRedo(), true)
	t.is(val.get(), 0)
	t.is(val.redo(), true)
	t.is(val.get(), 1)
})

test(`Undoable.clear`, (t) => {
	const val = new Undoable<{}[]>([{ x: 0, y: 0 }])
	val.set(val.get())
	val.set([{ x: 0, y: 0 }])
	val.set([{ y: 0, x: 0 }])

	val.clear([])
	t.is(val.canUndo(), false)
	t.deepEqual(val.get(), [])

	val.set([{ x: 0, y: 0, z: 8 }])
	val.set([{ x: 0 }])
	val.set([{ y: 0 }])

	val.clear()
	t.is(val.canUndo(), false)
	t.deepEqual(val.get(), [{ y: 0 }])
})

test(`Undoable.jump`, (t) => {
	const val = new Undoable<{}[]>([{ x: 0, y: 0 }])
	val.set(val.get())
	val.set([{ x: 1, y: 0 }])
	val.set([{ x: 2, y: 0, z: 8 }])
	val.set([{ x: 3 }])
	val.set([{ y: 4 }])

	t.is(val.jump(1), true)
	t.deepEqual(val.get(), [{ x: 1, y: 0 }])
	t.is(val.jump(8), false)
	t.deepEqual(val.get(), [{ x: 1, y: 0 }])

	t.is(val.jump(2), true)
	t.is(val.jump(2), false)
	t.deepEqual(val.get(), [{ x: 2, y: 0, z: 8 }])
})
