export declare class Undoable<T = unknown> {
    #private;
    capacity: number;
    constructor(initial: T, options?: {
        capacity: number;
    });
    get length(): number;
    get(): T;
    /**
     * @param newValue
     * @returns Succeed in adding it?
     */
    set(newValue: T): boolean;
    update(cb: (value: T) => T): boolean;
    /**
     * Method supposed to "extends"
     * @param nowValue
     * @param newValue
     * @returns
     */
    notEqual(nowValue: T, newValue: T): boolean;
    /**
     * Method supposed to "extends"
     * @param value
     * @returns
     */
    validator(value: T): T;
    undo(): this;
    redo(): this;
    canUndo(): boolean;
    canRedo(): boolean;
    reset(): this;
    clear(value?: T): this;
}
