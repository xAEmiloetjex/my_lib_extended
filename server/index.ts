import { KVStore } from "../lib/KVStore/index.js";
import { FileDriver } from "../lib/KVStore/drivers/FileDriver.js";
import { Vec, Spaces, VecTypes, type VecString } from "../lib/vector/index.js";
import { Logger } from "../lib/ddrm/logger.js";

import { WSS_CFG } from "../config.js";
import type { int } from "../lib/ddrm/index";
import { mkRandStr3, randomHSV, uniqueStore } from "../lib/ddrm/core/utils/common.js";
import { CHAR_LIST } from "../lib/ddrm/core/types/constants_1.js";

import {Matrix} from "../lib/matrix/index.js"

function dir(obj: any) {
    console.dir(obj, {depth:null, color: true});
}

function Vec1<T>(item?: T): Vec<T> {
    return item === undefined
        ? new Vec<T>().setSpace(Spaces.SINGLE)
        : new Vec<T>(item).setSpace(Spaces.SINGLE);
}

const $IMUT = Vec1<number>(69).imut().unsafe();
const $MUT  = Vec1<number>(420).mut().unsafe();

const $VEC0 = new Vec<int>()
    .mut()
    .unsafe()
    .readable(false);

const $VEC1 = new Vec<int>()
    .mut()
    .readable(false)
    .unsafe();

function get(vec: Vec<any>) {
    return vec.get();
}

function val() {
    return {
        $IMUT: $IMUT.get(),
        $MUT: $MUT.get()
    }
}

const mtrx = new Matrix();

(function main() {

dir(val())

// @ts-ignore
$IMUT['UwU'] = 'OwO'

// @ts-ignore
// $IMUT.#static = false;
$IMUT.set(8080)
$IMUT.values.set(0, 67);
// @ts-ignore
// $IMUT.#values.set(0, 6969);

$MUT.set(69);

// console.log($IMUT['UwU'])

dir(val())

const A = $IMUT.clone().mut();

A.set(67);
// A.readable(false);
dir({...val(), A: get(A)})

const UwU = new Vec()
    .setSpace(Spaces.ALPHABET)
    .unsafe(true)
    .fromString('__ivec[0,2,436,1]');
const OwO = UwU
    .clone()
    .setSpace(Spaces.VEC);

dir({
    UwU: UwU.map(),
    OwO: OwO.map()
})

//
let m_count = 0;
const m_rows = 16;
const m_cols = 16;

function seedMtrx() {
    // if (m_cols_count === m_cols - 1) {
    //     m_rows_count++;
    //     m_cols_count = 0;
    // }
    // if (m_cols_count === m_cols - 1)

    // mtrx.row(m_rows_count).col(m_cols_count).set(m_count);
    // m_count++

    for (let row_c = 0; row_c <= m_rows - 1; row_c++) {
        for (let col_c = 0; col_c <= m_cols - 1; col_c++) {
            mtrx.row(row_c).col(col_c).set(m_count);
            m_count++
        }
    }
    dir(mtrx.toNestedArray(m_rows, m_cols));
    dir(mtrx.toObject());
}

// seedMtrx()

// let newObj = mtrx.toObject();
// const mtrx2 = new Matrix();
// const mtrx3 = new Matrix();

// newObj['uwu'] = 69

// try {
//     mtrx2.fromObject(mtrx.toObject());
//     // mtrx2.fromObject(newObj);
// } catch(e) {
//     console.log(e)
// }

// try {
//     // dir(mtrx.toNestedArray(m_rows, m_cols))
//     mtrx3.fromNestedArray(mtrx.toNestedArray(m_rows, m_cols));
//     // dir(mtrx3.toObject())
// } catch(e) {
//     console.log('fromArr', e)
// }

// dir (mtrx3.toNestedArray(m_rows, m_cols));

[$VEC0, $VEC1].forEach((v,_i,_a) => {
    v.fromString('__ivec[0,1,2,3,4,5,6,7,8,9]');
});

const $VEC2 = $VEC0.clone().readable(true);

[$VEC0, $VEC1, $VEC2].forEach((v,i,_a) => {
    console.log(`========\nmap: ${i}`);
    dir({
        values: v.map(),
        isStatic: v.isStatic,
        isReadable: v.isReadable,
        unsafeAllowed: v.unsafeAllowed
    });
});

})()
