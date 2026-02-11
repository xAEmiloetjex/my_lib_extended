import type { int } from '../../lib/ddrm/index';
import { runTests } from '../../lib/ddrm/utils/testing.js';
import { VecTypes, Spaces, Vec, ALPHABET, genLabelByIdx } from '../../lib/vector/index.js';

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

function _sizeTest() {
    const store = new Vec<int>()
        .allowUnsafe(true);
    
    // // single
    // for (let i = 0; i < ALPHABET.length; i++) {
    //     store.add(i);
    // }
    // dir(Utils.extractKeysFromVecMap(store.map()));

    // // double
    // for (let i = 0; i < ALPHABET.length * ALPHABET.length; i++) {
    //     store.add(i);
    // }
    // dir(Utils.extractKeysFromVecMap(store.map()));

    // // tripple
    // for (let i = 0; i < ALPHABET.length * ALPHABET.length * ALPHABET.length; i++) {
    //     store.add(i);
    // }
    // dir(Utils.extractKeysFromVecMap(store.map()));

    // // 4
    // for (let i = 0; i < ALPHABET.length * ALPHABET.length * ALPHABET.length * ALPHABET.length; i++) {
    //     store.add(i);
    // }
    // dir(Utils.extractKeysFromVecMap(store.map()));
    // 5
    for (let i = 0; i < ALPHABET.length * ALPHABET.length * ALPHABET.length * ALPHABET.length * ALPHABET.length; i++) {
        try {
        store.add(i);
        } catch (e) {
            console.error('Error adding value at iteration', i, e);
            break;
        }
    }
    dir(Utils.PrintSizeAndLastKeyOfVecMap(store));
    // 6
    // for (let i = 0; i < ALPHABET.length * ALPHABET.length * ALPHABET.length * ALPHABET.length * ALPHABET.length * ALPHABET.length; i++) {
    //     store.add(i);
    // }
    // dir(Utils.extractKeysFromVecMap(store.map()));

    // console.log({
    //     memoryUsage: Deno.memoryUsage(),
    // })
}

function _runVectorTests() {
    _sizeTest();
}

export namespace vecTests {
    export const sizeTest = _sizeTest;
    export const runVectorTests = _runVectorTests;
}