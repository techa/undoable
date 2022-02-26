import test from 'ava'
import { Undoable } from './Undoable.js'

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
	val.set(3)
	val.set(4)
	t.is(val.undo().undo().redo().get(), 3)
})

test(`Undoable.length`, (t) => {
	const val = new Undoable(0)
	val.set(1)
	val.set(1)
	val.set(1)
	val.undo()
	t.is(val.length, 2)
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
	t.is(val.undo().undo().redo().get(), '3')
})

test(`ExUndoable.notEqual`, (t) => {
	class ExUndoable<T = unknown> extends Undoable<T> {
		notEqual(nowValue: T, newValue: T): boolean {
			return JSON.stringify(nowValue) !== JSON.stringify(newValue)
		}
	}
	const val = new ExUndoable<{}[]>([{ x: 0, y: 0 }])
	val.set([{ x: 0, y: 0 }])
	t.is(val.canUndo(), false)
	val.set([{ y: 0, x: 0 }])
	t.is(val.canUndo(), true)

	val.set([{ x: 0, y: 0, z: 8 }])
	val.set([{ x: 0 }])
	val.set([{ y: 0 }])
	t.deepEqual(val.undo().undo().redo().undo().get(), [{ x: 0, y: 0, z: 8 }])
})
