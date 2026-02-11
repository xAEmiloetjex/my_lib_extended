export function fSet() {
    let collection = [];
    function getCollection() {
        return [...collection];
    }
    function set(key) {
        if (has(key))
            return;
        collection.push(key);
    }
    function del(key) {
        return collection = collection.filter((v) => v !== key);
    }
    function _getIndex(idx) {
        const value = collection.find((v, i) => i === idx);
        const index = collection.findIndex((v, i) => i === idx);
        return { value, index };
    }
    function getIndex(idx) {
        return collection.find((v, i) => i === idx);
    }
    function _get(key) {
        const value = collection.find((v) => v === key);
        const index = collection.findIndex((v) => v === key);
        return { value, index };
    }
    function get(key) {
        return collection.find((v) => v === key);
    }
    function has(key) {
        return collection.includes(key);
    }
    const base = {
        collection: getCollection,
        set,
        get,
        has,
        del,
        getIndex,
        _get,
        _getIndex
    };
    const aliases = {
        all: getCollection,
        delete: del,
        getidx: getIndex,
        _getidx: _getIndex
    };
    return {
        ...base,
        ...aliases
    };
}
export function Set() {
    let collection = [];
    function getCollection() {
        return [...collection];
    }
    function set(key) {
        if (has(key))
            return;
        collection.push(key);
    }
    function del(key) {
        return collection = collection.filter((v) => v !== key);
    }
    function _getIndex(idx) {
        const value = collection.find((v, i) => i === idx);
        const index = collection.findIndex((v, i) => i === idx);
        return { value, index };
    }
    function getIndex(idx) {
        return collection.find((v, i) => i === idx);
    }
    function _get(key) {
        const value = collection.find((v) => v === key);
        const index = collection.findIndex((v) => v === key);
        return { value, index };
    }
    function get(key) {
        return collection.find((v) => v === key);
    }
    function has(key) {
        return collection.includes(key);
    }
    const base = {
        collection: getCollection,
        set,
        get,
        has,
        del,
        getIndex,
        _get,
        _getIndex
    };
    const aliases = {
        all: getCollection,
        delete: del,
        getidx: getIndex,
        _getidx: _getIndex
    };
    return {
        ...base,
        ...aliases
    };
}
export const uSet = fSet;
