class Stack<T> {

    private _store: T[] = [];

    constructor(intialValues: T[]) {
        this._store = intialValues;
    }

    public push(value: T) {
        this._store.push(value);
    }

    public pop() : T | undefined {
        return this._store.pop();
    }
}

export default Stack;
