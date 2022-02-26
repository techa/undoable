"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Undoable = void 0;
class Undoable {
    constructor(initial, options) {
        var _a;
        _Undoable_stack.set(this, void 0);
        _Undoable_index.set(this, 0);
        this.capacity = 50;
        __classPrivateFieldSet(this, _Undoable_stack, [this.validator(initial)], "f");
        this.capacity = (_a = options === null || options === void 0 ? void 0 : options.capacity) !== null && _a !== void 0 ? _a : this.capacity;
    }
    get length() {
        return __classPrivateFieldGet(this, _Undoable_stack, "f").length;
    }
    get() {
        return __classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")];
    }
    set(newValue) {
        var _a;
        if (this.notEqual(__classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")], newValue)) {
            if (__classPrivateFieldGet(this, _Undoable_stack, "f").length > __classPrivateFieldGet(this, _Undoable_index, "f") + 1) {
                __classPrivateFieldGet(this, _Undoable_stack, "f").length = __classPrivateFieldGet(this, _Undoable_index, "f") + 1;
            }
            __classPrivateFieldGet(this, _Undoable_stack, "f").push(this.validator(newValue));
            __classPrivateFieldSet(this, _Undoable_index, (_a = __classPrivateFieldGet(this, _Undoable_index, "f"), _a++, _a), "f");
            if (this.capacity > 1 && __classPrivateFieldGet(this, _Undoable_stack, "f").length > this.capacity) {
                __classPrivateFieldGet(this, _Undoable_stack, "f").shift();
                __classPrivateFieldSet(this, _Undoable_index, __classPrivateFieldGet(this, _Undoable_stack, "f").length, "f");
            }
        }
    }
    update(cb) {
        this.set(cb(__classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")]));
        return;
    }
    /**
     * Method supposed to "extends"
     * @param nowValue
     * @param newValue
     * @returns
     */
    notEqual(nowValue, newValue) {
        return nowValue != nowValue
            ? newValue == newValue
            : nowValue !== newValue ||
                (nowValue && typeof nowValue === 'object') ||
                typeof nowValue === 'function';
    }
    /**
     * Method supposed to "extends"
     * @param value
     * @returns
     */
    validator(value) {
        return value;
    }
    undo() {
        var _a;
        if (__classPrivateFieldGet(this, _Undoable_index, "f") > 0) {
            __classPrivateFieldSet(this, _Undoable_index, (_a = __classPrivateFieldGet(this, _Undoable_index, "f"), _a--, _a), "f");
        }
        this.set(__classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")]);
        return this;
    }
    redo() {
        var _a;
        if (__classPrivateFieldGet(this, _Undoable_index, "f") < __classPrivateFieldGet(this, _Undoable_stack, "f").length - 1) {
            __classPrivateFieldSet(this, _Undoable_index, (_a = __classPrivateFieldGet(this, _Undoable_index, "f"), _a++, _a), "f");
        }
        this.set(__classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")]);
        return this;
    }
    canUndo() {
        return __classPrivateFieldGet(this, _Undoable_index, "f") > 0;
    }
    canRedo() {
        return __classPrivateFieldGet(this, _Undoable_index, "f") < __classPrivateFieldGet(this, _Undoable_stack, "f").length - 1;
    }
    reset() {
        __classPrivateFieldSet(this, _Undoable_index, 0, "f");
        this.set(__classPrivateFieldGet(this, _Undoable_stack, "f")[__classPrivateFieldGet(this, _Undoable_index, "f")]);
        return this;
    }
    clear() {
        __classPrivateFieldSet(this, _Undoable_stack, __classPrivateFieldGet(this, _Undoable_stack, "f").slice(0, 1), "f");
        return this.reset();
    }
}
exports.Undoable = Undoable;
_Undoable_stack = new WeakMap(), _Undoable_index = new WeakMap();
