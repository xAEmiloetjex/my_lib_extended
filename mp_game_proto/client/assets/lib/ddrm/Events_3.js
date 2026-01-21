import { EventQueue } from "./core/EventQueue_3";
/**
 * The EventEmitter Class
 */
export class EventEmitter extends EventQueue {
    prefix;
    constructor(prefix = "") {
        super();
        this.prefix = prefix;
    }
    // public AbstractionClass: this = this;
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     *
     * ! Warning.. If you use a single-use event listener on a global event
     *
     * ! then it bugs out the whole global queue!
     *
     * ! Instead maybe use a normal `<EventEmitter>.on()` method with an if statement
     *
     * ! To block multiple uses
     */
    addSingleUseListener(id, handler) {
        const name = this.prefix + id;
        return super.addSingleUseListener(name, handler);
    }
    /**
     * Add an event listener
     */
    addListener(id, handler) {
        const name = this.prefix + id;
        return super.addListener(name, handler);
    }
    /**
     * Remove an event listener
     *
     * ! NOTE: This isn't implemented for the global events yet
     */
    removeListener(id, listeners, opts) {
        const name = this.prefix + id;
        super.removeListener(name, listeners, opts);
    }
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     *
     * ! Warning.. If you use a single-use event listener on a global event
     *
     * ! then it bugs out the whole global queue!
     *
     * ! Instead maybe use a normal `<EventEmitter>.on()` method with an if statement
     *
     * ! To block multiple uses
     */
    once(id, handler) {
        const name = this.prefix + id;
        return super.addSingleUseListener(name, handler);
    }
    /**
     * Add an event listener
     */
    on(id, handler) {
        const name = this.prefix + id;
        return super.addListener(name, handler);
    }
    /**
     * Remove an event listener
     *
     * ! NOTE: This isn't implemented for the global events yet
     */
    off(id, listeners, opts) {
        const name = this.prefix + id;
        super.removeListener(name, listeners, opts);
    }
    /**
     * Remove all event listeners belogning to the specified event
     *
     * ! NOTE: This isn't implemented for the global events yet
     */
    removeAllListeners(name) {
        super.removeAllListeners(name);
    }
    /**
     * Emit an event
     */
    emit(id, ..._data) {
        const name = this.prefix + id;
        return super.emit(name, ..._data);
    }
}
export const EventEmitter3 = EventEmitter;
