export function html(location) {
    let elem = document.querySelector(location);
    const returns = { set, on, get, add, attr, env };
    if (elem == null)
        elem = document.body;
    function attr(name) {
        function set(value) {
            return elem?.setAttribute(name, value);
        }
        function has() {
            return elem?.hasAttribute(name);
        }
        function get() {
            return elem?.getAttribute(name);
        }
        function remove() {
            return elem?.removeAttribute(name);
        }
        return { set, remove, get, has };
    }
    function set(code) {
        return {
            el: (elem.innerHTML = code),
            _: returns
        };
    }
    function add(code) {
        return {
            el: (elem.innerHTML = code),
            _: returns
        };
    }
    function get() {
        return elem;
    }
    function on(event, cb) {
        return elem?.addEventListener(event, (...ev) => cb({ ...returns }, ...ev));
    }
    function env(cb) {
        return cb(returns);
    }
    return returns;
}
