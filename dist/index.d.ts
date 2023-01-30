export interface UndoableOptions {
    capacity?: number;
}
export declare class Undoable<T = unknown> {
    #private;
    capacity: number;
    constructor(initial: T, options?: UndoableOptions);
    get length(): number;
    get(): T;
    /**
     * @param newValue
     * @returns Succeed in adding it?
     */
    set(newValue: T): boolean;
    update(cb: (value: T) => T): boolean;
    /**
     * extend methd
     */
    onCapacityOver(): void;
    /**
     * Method supposed to "extends"
     * @param value
     * @returns
     * @used constructor() .set() .clear()
     */
    validator(value: T): string;
    jump(index: number): boolean;
    undo(): boolean;
    redo(): boolean;
    canUndo(): boolean;
    canRedo(): boolean;
    reset(): this;
    clear(value?: T): this;
}
