export function framework(query) {
    const _elem = document.querySelector(query);
    const elem = _elem !== null ? _elem : document.body;
    const returns = { set, on, get, add, attr, env };
    function set(code) {
        return {
            el: (elem.innerHTML = code),
            _: returns
        };
    }
    function add(code) {
        return {
            el: (elem.innerHTML += code),
            _: returns
        };
    }
    function attr(key) {
        function get() {
            return elem.getAttribute(key);
        }
        function set(value) {
            return elem.setAttribute(key, value);
        }
        function has() {
            return elem.hasAttribute(key);
        }
        function remove() {
            return elem.removeAttribute(key);
        }
        return { get, set, has, remove };
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
export const v1 = framework;
export const html = framework;
