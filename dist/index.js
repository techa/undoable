var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Undoable_stack, _Undoable_index;
export class Undoable {
    constructor(initial, options) {
        _Undoable_stack.set(this, void 0);
        _Undoable_index.set(this, 0);
        this.capacity = 50;
        __classPrivateFieldSet(this, _Undoable_stack, [this.validator(initial)], "f");
        this.capacity = options?.capacity ?? this.capacity;
    }
    get length() {
        return __classPrivateFieldGet(this, _Undoable_stack, "f").length;
    }
    get() {
        return JSON.parse(__classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")]);
    }
    /**
     * @param newValue
     * @returns Succeed in adding it?
     */
    set(newValue) {
        var _a;
        const newVal = this.validator(newValue);
        const notEqual = __classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")] !== newVal;
        if (notEqual) {
            if (__classPrivateFieldGet(this, _Undoable_stack, "f").length > __classPrivateFieldGet(this, _Undoable_index, "f") + 1) {
                __classPrivateFieldGet(this, _Undoable_stack, "f").length = __classPrivateFieldGet(this, _Undoable_index, "f") + 1;
            }
            __classPrivateFieldGet(this, _Undoable_stack, "f").push(newVal);
            __classPrivateFieldSet(this, _Undoable_index, (_a = __classPrivateFieldGet(this, _Undoable_index, "f"), _a++, _a), "f");
            if (this.capacity > 1 && __classPrivateFieldGet(this, _Undoable_stack, "f").length > this.capacity) {
                __classPrivateFieldGet(this, _Undoable_stack, "f").shift();
                __classPrivateFieldSet(this, _Undoable_index, __classPrivateFieldGet(this, _Undoable_stack, "f").length - 1, "f");
                this.onCapacityOver();
            }
        }
        return notEqual;
    }
    update(cb) {
        return this.set(cb(this.get()));
    }
    /**
     * extend methd
     */
    onCapacityOver() { }
    /**
     * Method supposed to "extends"
     * @param value
     * @returns
     * @used constructor() .set() .clear()
     */
    validator(value) {
        if (typeof value === 'string') {
            return value;
        }
        return JSON.stringify(value);
    }
    jump(index) {
        if (Number.isInteger(index) &&
            __classPrivateFieldGet(this, _Undoable_index, "f") !== index &&
            index < __classPrivateFieldGet(this, _Undoable_stack, "f").length) {
            __classPrivateFieldSet(this, _Undoable_index, index, "f");
            return true;
        }
        return false;
    }
    undo() {
        var _a;
        if (__classPrivateFieldGet(this, _Undoable_index, "f") > 0) {
            __classPrivateFieldSet(this, _Undoable_index, (_a = __classPrivateFieldGet(this, _Undoable_index, "f"), _a--, _a), "f");
            return true;
        }
        return false;
    }
    redo() {
        var _a;
        if (__classPrivateFieldGet(this, _Undoable_index, "f") < __classPrivateFieldGet(this, _Undoable_stack, "f").length - 1) {
            __classPrivateFieldSet(this, _Undoable_index, (_a = __classPrivateFieldGet(this, _Undoable_index, "f"), _a++, _a), "f");
            return true;
        }
        return false;
    }
    canUndo() {
        return __classPrivateFieldGet(this, _Undoable_index, "f") > 0;
    }
    canRedo() {
        return __classPrivateFieldGet(this, _Undoable_index, "f") < __classPrivateFieldGet(this, _Undoable_stack, "f").length - 1;
    }
    reset() {
        __classPrivateFieldSet(this, _Undoable_index, 0, "f");
        this.set(this.get());
        __classPrivateFieldSet(this, _Undoable_index, 0, "f");
        return this;
    }
    clear(value) {
        __classPrivateFieldSet(this, _Undoable_stack, [
            value === undefined
                ? __classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")]
                : this.validator(value),
        ], "f");
        __classPrivateFieldSet(this, _Undoable_index, 0, "f");
        return this;
    }
}
_Undoable_stack = new WeakMap(), _Undoable_index = new WeakMap();
