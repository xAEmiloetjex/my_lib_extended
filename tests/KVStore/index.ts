import type { int } from '../../lib/ddrm';
import { runTests } from '../../lib/ddrm/utils/testing.js';
import { VecTypes, Spaces, Vec, ALPHABET, genLabelByIdx, type VecString } from '../../lib/vector/index.js';

import { KVStore } from '../../lib/KVStore/index.js';
import { FileDriver } from '../../lib/KVStore/drivers/FileDriver.js';

type MetaValueType = string | number | boolean | null | undefined;

const store = new Vec<any>()
    .allowUnsafe(false)
    .readonly(true);

const db = new KVStore({
    Driver: new FileDriver(),
    tablePrefix: 'kvs_test_',
});



const dir = (obj: any) => console.dir(obj, { depth: null, colors: true });
namespace Utils {
    export function extractKeysFromVecMap(map: {[x: string]: int}): {length: number, last: string, keys: string[]} {
        const keys: string[] = [];
        for (const key in map) {
            keys.push(key);
        }
        return {length: keys.length, last: keys[keys.length - 1], keys};
    }

    export function PrintSizeAndLastKeyOfVecMap(map: Vec<any>) {
        return {
            length: map.length,
            last: {
                key: genLabelByIdx(map.length - 1),
                value: map.getIdx(map.length - 1)
            }
        }
    }
}

function _metaTest() {
    console.log('\n--- KVStore Meta Test ---\n');
    // generate DB_META structure
    const DB_META = new Vec<Vec<string>|VecString>()
            .setSpace(Spaces.VEC2)
            .allowUnsafe(true);

    const DB_META_KEYS = new Vec<string>()
        .setSpace(Spaces.ALPHABET)
        .allowUnsafe(true)
        .fromArray(['name', 'prefix'])
        .readonly(true); 

    const DB_META_VALUES = new Vec<string>()
        .setSpace(Spaces.ALPHABET)
        .allowUnsafe(true);

    DB_META.set('x', DB_META_KEYS);
    DB_META.set('y', DB_META_VALUES);
    // END generate DB_META structure
    
    DB_META_VALUES.setIdx(0, 'Test DB');
    DB_META_VALUES.setIdx(1, 'kvs_test_');

    DB_META.set('x', DB_META_KEYS.toString());
    DB_META.set('y', DB_META_VALUES.toString());
    
    dir(DB_META);

    // store DB_META in KVStore
    const resSet = db.set('DB_META', DB_META.allowUnsafe(false).readonly(true).toString(true));

    db.Driver.Save()

    dir(db.get('DB_META'));

    // console.log({
    //     memoryUsage: Deno.memoryUsage(),
    // })
}

function _basicStoreTest() {
    console.log('\n--- KVStore Basic Store Test ---\n');
    db.set('test_key_string', 'Hello, KVStore!');
    db.set('test_key_number', 42);
    db.set('test_key_boolean', true);
    db.set('test_key_null', null);
    db.set('test_key_undefined', undefined);
    db.set('test_key_array', [1, 2, 3, 4, 5]);
    db.set('test_key_object', {a: 1, b: 'two', c: true});
    
    
    db.Driver.Save()

    // console.log({
    //     memoryUsage: Deno.memoryUsage(),
    // })
}

function _basicLoadTest() {
    console.log('\n--- KVStore Basic Load Test ---\n');
    const test_db = new KVStore({
        Driver: new FileDriver(),
        tablePrefix: 'kvs_test_',
    });
    const test_db2 = new KVStore({
        Driver: new FileDriver('./db2.json'),
        tablePrefix: 'kvs_test2_',
    });

    dir(test_db.Driver.Store)

    test_db2.Driver.Store = test_db.Driver.Store;

    const DB_META_str = test_db.get('DB_META');

    const DB_META = new Vec<Vec<string>|VecString>()
        .setSpace(Spaces.VEC2)
        .allowUnsafe(true)
        .fromString(DB_META_str)
        .readonly(true);

    const DB_META_KEYS = new Vec<string>()
        .setSpace(Spaces.ALPHABET)
        .allowUnsafe(true)
        .fromString(DB_META.get('x') as VecString)
        .readonly(true);

    const DB_META_VALUES = new Vec<string>()
        .setSpace(Spaces.ALPHABET)
        .allowUnsafe(true)
        .fromString(DB_META.get('y') as VecString)
        .readonly(false);

    DB_META_VALUES.setIdx(1, 'kvs_test2_');



    DB_META.readonly(false);

    DB_META.set('x', DB_META_KEYS.toString());
    DB_META.set('y', DB_META_VALUES.toString());

    DB_META.readonly(false);

    

    console.log(DB_META_VALUES.toString(), DB_META.get('y'));

    console.log(DB_META.allowUnsafe(false).readonly(true).toString(true))

    test_db2.set('DB_META', DB_META.allowUnsafe(false).readonly(true).toString(true));

    test_db2.Driver.Save();

    // console.log({
    //     memoryUsage: Deno.memoryUsage(),
    // })
}

function _runKvsTests() {
    _metaTest();
    _basicStoreTest();
    _basicLoadTest();

    console.log('\n--- KVStore Tests Completed ---\n');
    // console.log({
    //     memoryUsage: Deno.memoryUsage(),
    // })
}

export namespace kvsTests {
    export const metaTest = _metaTest;
    export const basicStoreTest = _basicStoreTest;
    export const basicLoadTest = _basicLoadTest;
    export const runKvsTests = _runKvsTests;
}