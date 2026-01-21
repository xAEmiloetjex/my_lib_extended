var indexOf;
if (typeof Array.prototype.indexOf === 'function') {
    indexOf = function (haystack, needle) {
        return haystack.indexOf(needle);
    };
}
else {
    indexOf = function (haystack, needle) {
        var i = 0, length = haystack.length, idx = -1, found = false;
        while (i < length && !found) {
            if (haystack[i] === needle) {
                idx = i;
                found = true;
            }
            i++;
        }
        return idx;
    };
}
;
export class EventQueue {
    events = {};
    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        return this.events[event].push(listener);
    }
    removeListener(event, listener) {
        let idx;
        if (typeof this.events[event] === 'object') {
            idx = indexOf(this.events[event], listener);
            if (idx > -1) {
                return this.events[event].splice(idx, 1);
            }
        }
    }
    once(event, listener) {
        const that = this;
        return this.on(event, function g() {
            that.removeListener(event, g);
            listener.apply(this, arguments);
        });
    }
    emit(event) {
        let i, listeners, length, args = [].slice.call(arguments, 1);
        if (typeof this.events[event] === 'object') {
            listeners = this.events[event].slice();
            length = listeners.length;
            for (i = 0; i < length; i++) {
                listeners[i].apply(this, args);
            }
        }
    }
}
