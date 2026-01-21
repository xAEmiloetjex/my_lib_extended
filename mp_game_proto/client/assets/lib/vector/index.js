import { findMap } from "../ddrm/core/utils/common.js";
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export function genLabelByIdx(idx) {
    if (idx < 0)
        return '';
    let n = idx + 1;
    let result = '';
    while (n > 0) {
        n--;
        result = ALPHABET[n % 52] + result;
        n = Math.floor(n / 52);
    }
    return result;
}
export var VecTypes;
(function (VecTypes) {
    // TODO: add types for the readable flag!
    /**
     * Standard Vector
     */
    VecTypes["VEC"] = "__vec";
    /**
     * Vector with unsafe operations
     */
    VecTypes["UVEC"] = "__uvec";
    /**
     * Readonly Vector
     */
    VecTypes["SVEC"] = "__svec";
    /**
     * Readonly Vector with unsafe operations
     */
    VecTypes["SUVEC"] = "__suvec";
    /**
     * Inherit Parent Vector
     */
    VecTypes["IVEC"] = "__ivec";
})(VecTypes || (VecTypes = {}));
export var Spaces;
(function (Spaces) {
    Spaces[Spaces["SINGLE"] = 0] = "SINGLE";
    Spaces[Spaces["RGB"] = 1] = "RGB";
    Spaces[Spaces["RGBA"] = 2] = "RGBA";
    Spaces[Spaces["VEC"] = 3] = "VEC";
    Spaces[Spaces["QUATERNION"] = 4] = "QUATERNION";
    Spaces[Spaces["VEC1"] = 5] = "VEC1";
    Spaces[Spaces["VEC2"] = 6] = "VEC2";
    Spaces[Spaces["VEC3"] = 7] = "VEC3";
    Spaces[Spaces["VEC4"] = 8] = "VEC4";
    Spaces[Spaces["ALPHABET"] = 9] = "ALPHABET";
})(Spaces || (Spaces = {}));
export class Vec {
    _space = Spaces.ALPHABET;
    _values = new Map();
    _length = () => this._values.size;
    _static = false;
    _readable = true;
    _unsafe = false;
    get values() {
        if (this._readable !== true)
            return new Map();
        return this._values;
    }
    get length() {
        if (this._readable !== true)
            return 0;
        return this._length();
    }
    get space() {
        return this._space;
    }
    /**
     * Alias for `isReadonly`
     */
    get isStatic() {
        return this._static;
    }
    get isReadonly() {
        return this._static;
    }
    get isReadable() {
        return this._readable;
    }
    get unsafeAllowed() {
        return this._unsafe;
    }
    constructor(...values) {
        for (let i = 0; i < values.length; i++) {
            this._values.set(i, values[i]);
        }
    }
    setSpace(space) {
        this._space = space;
        return this;
    }
    allowUnsafe(state) {
        if (state === undefined)
            this._unsafe = true;
        else
            this._unsafe = state;
        return this;
    }
    /**
     * Alias for `readonly()`
     */
    static(state) {
        return this.readonly(state);
    }
    readonly(state) {
        if (state === undefined)
            this._static = true;
        else
            this._static = state;
        return this;
    }
    readable(state) {
        if (state === undefined)
            this._readable = true;
        else
            this._readable = state;
        return this;
    }
    // operations
    add(value) {
        if (this._static === true)
            return;
        this._values.set(this.length, value);
    }
    // public remove(value: T) { }
    // public set(k: string, v: T) { }
    get(k) {
        if (this._readable !== true)
            return null;
        const m = this.map();
        return m[k];
    }
    getIdx(idx) {
        if (this._readable !== true)
            return null;
        return this._values.get(idx);
    }
    // unsafe operations
    set(label, value) {
        if (this._static === true)
            return;
        if (this._unsafe !== true)
            return;
        const idxMap = this.idxMap();
        const find = findMap(idxMap, 'label', label);
        this._values.set(find, value);
        return this;
    }
    remove(label, value) {
        if (this._static === true)
            return;
        if (this._unsafe !== true)
            return;
        const idxMap = this.idxMap();
        const find = findMap(idxMap, 'label', label);
        this._values.delete(find);
        return this;
    }
    removeIdx(idx) {
        if (this._static === true)
            return;
        if (this._unsafe !== true)
            return;
        this._values.delete(idx);
    }
    setIdx(idx, value) {
        if (this._static === true)
            return;
        if (this._unsafe !== true)
            return;
        this._values.set(idx, value);
    }
    // utils
    idxMap(space = this._space) {
        if (this._readable !== true)
            return [];
        let arr = [];
        const v = this.toArray();
        if (space === Spaces.VEC) {
            if (this.length === 1)
                space = Spaces.VEC1;
            if (this.length === 2)
                space = Spaces.VEC2;
            if (this.length === 3)
                space = Spaces.VEC3;
            if (this.length === 4)
                space = Spaces.VEC4;
        }
        if (space === Spaces.SINGLE)
            space = Spaces.VEC1;
        if (space === Spaces.QUATERNION)
            space = Spaces.VEC4;
        if (space === Spaces.RGB) {
            arr.push({ idx: 0, label: "r", value: v[0] });
            arr.push({ idx: 1, label: "g", value: v[1] });
            arr.push({ idx: 2, label: 'b', value: v[2] });
        }
        if (space === Spaces.RGBA) {
            arr.push({ idx: 0, label: "r", value: v[0] });
            arr.push({ idx: 1, label: "g", value: v[1] });
            arr.push({ idx: 2, label: 'b', value: v[2] });
            arr.push({ idx: 3, label: 'a', value: v[3] });
        }
        if (space === Spaces.VEC1) {
            arr.push({ idx: 0, label: "x", value: v[0] });
        }
        if (space === Spaces.VEC2) {
            arr.push({ idx: 0, label: "x", value: v[0] });
            arr.push({ idx: 1, label: "y", value: v[1] });
        }
        if (space === Spaces.VEC3) {
            arr.push({ idx: 0, label: "x", value: v[0] });
            arr.push({ idx: 1, label: "y", value: v[1] });
            arr.push({ idx: 2, label: "z", value: v[2] });
        }
        if (space === Spaces.VEC4) {
            arr.push({ idx: 0, label: "x", value: v[0] });
            arr.push({ idx: 1, label: "y", value: v[1] });
            arr.push({ idx: 2, label: "z", value: v[2] });
            arr.push({ idx: 3, label: "w", value: v[3] });
        }
        if (space === Spaces.ALPHABET) {
            for (let i = 0; i < v.length; i++) {
                // 0) [ALPHABET[1]] = v[1]:
                arr.push({ idx: i, label: genLabelByIdx(i), value: v[i] });
            }
            return arr;
        }
        return arr;
    }
    toArray() {
        if (this._readable !== true)
            return [];
        let arr = [];
        this.values.forEach((v, k, m) => {
            arr.push(v);
        });
        return arr;
    }
    ;
    map(space) {
        if (this._readable !== true)
            return {};
        if (space === undefined)
            space = this._space;
        const v = this.toArray();
        if (space === Spaces.VEC) {
            if (this.length === 1)
                space = Spaces.VEC1;
            if (this.length === 2)
                space = Spaces.VEC2;
            if (this.length === 3)
                space = Spaces.VEC3;
            if (this.length === 4)
                space = Spaces.VEC4;
        }
        if (space === Spaces.SINGLE)
            space = Spaces.VEC1;
        if (space === Spaces.QUATERNION)
            space = Spaces.VEC4;
        if (space === Spaces.RGB)
            return { r: v[0], g: v[1], b: v[2] };
        if (space === Spaces.RGBA)
            return { r: v[0], g: v[1], b: v[2], a: v[3] };
        if (space === Spaces.VEC1)
            return { x: v[0] };
        if (space === Spaces.VEC2)
            return { x: v[0], y: v[1] };
        if (space === Spaces.VEC3)
            return { x: v[0], y: v[1], z: v[2] };
        if (space === Spaces.VEC4)
            return { x: v[0], y: v[1], z: v[2], w: v[3] };
        if (space === Spaces.ALPHABET) {
            let obj = {};
            for (let i = 0; i < v.length; i++) {
                obj[genLabelByIdx(i)] = v[i];
            }
            return obj;
        }
        return {};
    }
    clone() {
        return new Vec(...(this.toArray()));
    }
    toString(inheritParentProps = false) {
        if (inheritParentProps === true)
            return `__ivec${JSON.stringify(this.toArray())}`;
        if (this._static === true && this._unsafe === true)
            return `__suvec${JSON.stringify(this.toArray())}`;
        else if (this._static === true)
            return `__svec${JSON.stringify(this.toArray())}`;
        else if (this._unsafe === true)
            return `__uvec${JSON.stringify(this.toArray())}`;
        else
            return `__vec${JSON.stringify(this.toArray())}`;
    }
    fromArray(values) {
        if (this._static === true)
            return this;
        if (this._unsafe !== true)
            return this;
        for (let i = 0; i < values.length; i++) {
            this.setIdx(i, values[i]);
        }
        return this;
    }
    fromString(str) {
        if (!(str.startsWith('__vec') ||
            str.startsWith('__svec') ||
            str.startsWith('__uvec') ||
            str.startsWith('__suvec') ||
            str.startsWith('__ivec')))
            return this;
        /** */
        let oUnsafe = false;
        let oStatic = false;
        if (this._unsafe === true)
            oUnsafe = true;
        if (this._static === true)
            oStatic = true;
        /** */
        let type = VecTypes.VEC;
        let arrStr = '';
        let arr = [];
        /** */
        this.readonly(false);
        this.allowUnsafe(true);
        if (str.startsWith('__vec'))
            type = VecTypes.VEC;
        if (str.startsWith('__svec'))
            type = VecTypes.SVEC;
        if (str.startsWith('__uvec'))
            type = VecTypes.UVEC;
        if (str.startsWith('__suvec'))
            type = VecTypes.SUVEC;
        if (str.startsWith('__ivec'))
            type = VecTypes.IVEC;
        arrStr = str.replace(type, '');
        arr = JSON.parse(arrStr);
        this.fromArray(arr);
        if (type === VecTypes.VEC) {
            this.readonly(false);
            this.allowUnsafe(false);
        }
        else if (type === VecTypes.UVEC) {
            this.allowUnsafe(true);
            this.static(false);
        }
        else if (type === VecTypes.SVEC) {
            this.allowUnsafe(false);
            this.static(true);
        }
        else if (type === VecTypes.SUVEC) {
            this.allowUnsafe(true);
            this.static(true);
        }
        else if (type === VecTypes.IVEC) {
            this.readonly(oStatic);
            this.allowUnsafe(oUnsafe);
        }
        else {
            return this;
        }
        return this;
    }
}
