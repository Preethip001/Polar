/**
 * Implement a class named ring buffer with fixed capacity such that
 *
 * constructor: takes the capacity for the ring buffer
 *
 * push: adds a value to the ring buffer.
 * pop: removes the last value from the ring buffer or undefined if it's empty.
 * peek: returns the current value of the most recent value added or undefined if none have been added
 *
 * If we have too many values (exceeding capacity) the oldest values are lost.
 *
 * The ordering of the push operations must be kept.
 */
export class RingBuffer<T> {

    private storage = new Array<T>();
    private capacity: number; 

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public push(value: T) {
        this.storage.push(value); 
        if(this.storage.length > this.capacity) {
            this.storage.shift();
        }
    }

    public peek(): T | undefined {
        if(this.storage.length == 0) {
            return undefined
        }

        return this.storage[this.storage.length - 1]
    }

    public pop(): T | undefined {
        return this.storage.pop()
    }

}
