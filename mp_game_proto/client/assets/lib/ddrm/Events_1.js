import { EventClass } from "./core/EventQueue_1";
/**
 * The EventEmitter Class
 */
export class EventEmitter extends EventClass {
    prefix;
    constructor(prefix = "") {
        super();
        this.prefix = prefix;
    }
    /**
     * Add an event listener
     */
    addListener(id, handler) {
        const name = this.prefix + id;
        super.addListener(name, handler);
    }
    /**
     * Remove an event listener
     */
    removeListener(id, handler) {
        const name = this.prefix + id;
        super.removeListener(name, handler);
    }
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     */
    addSingleUseListener(id, handler) {
        const name = this.prefix + id;
        super.addSingleUseListener(name, handler);
    }
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     */
    once(id, handler) {
        const name = this.prefix + id;
        super.addSingleUseListener(name, handler);
    }
    /**
     * Add an event listener
     */
    on(id, handler) {
        const name = this.prefix + id;
        super.addListener(name, handler);
    }
    /**
     * Remove an event listener
     */
    off(id, handler) {
        const name = this.prefix + id;
        super.removeListener(name, handler);
    }
    /**
     * Remove all event listeners belogning to the specified event
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
