import { KVStore } from "../lib/KVStore/index.js";
import { FileDriver } from "../lib/KVStore/drivers/FileDriver.js";
import { Vec, Spaces, VecTypes, type VecString } from "../lib/vector/index.js";
import { Logger } from "../lib/ddrm/logger.js";

import { WSS_CFG } from "../config.js";
import type { int } from "../lib/ddrm/index";
import { mkRandStr3, randomHSV, uniqueStore } from "../lib/ddrm/core/utils/common.js";
import { CHAR_LIST } from "../lib/ddrm/core/types/constants_1.js";

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

function get(vec: Vec<any>) {
    return vec.get();
}

function val() {
    return {
        $IMUT: $IMUT.get(),
        $MUT: $MUT.get()
    }
}

(function main() {

dir(val())

$IMUT.set(420);
$MUT.set(69);
dir(val())

const A = $IMUT.clone().mut();

A.set(67);
// A.readable(false);
dir({...val(), A: get(A)})

})()