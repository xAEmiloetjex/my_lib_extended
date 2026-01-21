export function _map() {
    let map_store = [];
    function entries() {
        return map_store.map(item => [item.key, item.value]);
    }
    function keys() {
        return map_store.map(item => item.key);
    }
    function values() {
        return map_store.map(item => item.value);
    }
    function length() {
        return map_store.length;
    }
    function set(key, value) {
        if (has(key))
            del(key);
        return map_store.push({
            key,
            value,
        });
    }
    function get(key) {
        const item = map_store.find((item) => item.key === key);
        if (item) {
            return item.value;
        }
        else {
            return new Error("Key not found");
        }
    }
    function getAll() {
        return map_store;
    }
    function has(key) {
        return map_store.some((item) => item.key === key);
    }
    function del(key) {
        return map_store = map_store.filter((item) => item.key !== key);
    }
    function clear() {
        return map_store = [];
    }
    function insert(map) {
        return map_store = [...map_store, ...map];
    }
    function replace(map) {
        return map_store = map;
    }
    function toTrueMap() {
        let new_store = [];
        map_store.forEach((item) => {
            new_store.push([item.key, item.value]);
        });
        return new_store;
    }
    const operators = {
        set,
        get,
        getAll,
        has,
        del,
        entries,
        keys,
        values,
        length,
    };
    const aliases = {
        delete: del,
        all: getAll,
    };
    const manager = {
        clear,
        insert,
        replace,
        toTrueMap
    };
    return {
        ...operators,
        ...aliases,
        manager,
    };
}
export function trueMap() {
    //? let map_store: [K,V][] = [];
    let map_store = Array();
    function entries() {
        return [...map_store]; // TrueMap already stores as [K,V] pairs
    }
    function keys() {
        return map_store.map(item => item[0]);
    }
    function values() {
        return map_store.map(item => item[1]);
    }
    function length() {
        return map_store.length;
    }
    function set(key, value) {
        // console.trace('set', key, value)
        if (has(key))
            del(key);
        return map_store.push([key, value]);
    }
    function get(key) {
        const item = map_store.find((_item) => _item[0] === key);
        if (item) {
            return item[1];
        }
        else {
            console.error(new Error('Key not found'));
            return undefined;
        }
    }
    function has(key) {
        try {
            return map_store.some(item => item[0] === key);
        }
        catch (e) {
            // console.error('error in has', e)
            return false;
        }
    }
    function del(key) {
        return map_store = map_store.filter(item => item[0] !== key);
    }
    // function getAll(): TTruemapItem<K,V>[] {
    //     return map_store
    // }
    function clear() {
        return map_store = [];
    }
    function insert(map) {
        return map_store = [...map_store, ...map];
    }
    function replace(map) {
        return map_store = map;
    }
    function toHumanMap() {
        let new_store = [];
        map_store.forEach((item) => {
            new_store.push({ key: item[0], value: item[1] });
        });
        return new_store;
    }
    const operators = {
        set,
        get,
        has,
        del,
        entries,
        keys,
        values,
        length,
    };
    const aliases = {
        delete: del,
        all: entries,
        getAll: entries,
    };
    const manager = {
        clear,
        insert,
        replace,
        toHumanMap
    };
    return {
        ...operators,
        ...aliases,
        manager,
        size: 0
        // get size() {
        //     return map_store.length
        // },
        // map_store
    };
}
export const LabeledMap = _map;
export const ArrayedMap = trueMap;
