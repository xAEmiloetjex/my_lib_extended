
import type { int } from "../ddrm";
import { findMap } from "../ddrm/core/utils/common.js";

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function genLabelByIdx(idx: number): string {
    if (idx < 0) return '';
    let n = idx + 1;
    let result = '';
    while (n > 0) {
        n--;
        result = ALPHABET[n % 52] + result;
        n = Math.floor(n / 52);
    }
    return result;
}

export type VecString<T extends string = string> =
    | `__vec${string}`
    | `__uvec${string}`
    | `__svec${string}`
    | `__suvec${string}`
    | `__ivec${string}`
    | `__evec${string}`
    | `__sevec${string}`
    | `__uevec${string}`
    | `__suevec${string}`;

export enum VecTypes {
    // TODO: add types for the readable flag!

    /**
     * Standard Vector
     */
    VEC = '__vec',

    /**
     * Vector with unsafe operations
     */
    UVEC = '__uvec',

    /**
     * Readonly Vector
     */
    SVEC = '__svec',

    /**
     * Readonly Vector with unsafe operations
     */
    SUVEC = '__suvec',

    /**
     * Empty (noRead) Vector
     */
    EVEC = '__evec',

    /**
     * Static Empty (noRead) Vector
     */
    SEVEC = '__sevec',

    /**
     * Unsafe Empty (noRead) Vector
     */
    UEVEC = '__uevec',

    /**
     * Unsafe Static Empty (noRead) Vector
     */
    SUEVEC = '__suevec',

    /**
     * Inherit Parent Vector
     */
    IVEC = '__ivec',
}

export enum Spaces {
    SINGLE,
    RGB,
    RGBA,
    VEC,
    QUATERNION,
    VEC1,
    VEC2,
    VEC3,
    VEC4,
    ALPHABET
}

export class Vec<T> {
    private _space: Spaces = Spaces.ALPHABET;

    private _values: Map<int, T> = new Map<int, T>();
    private _length: () => int = () => this._values.size;

    private _static  : boolean = false;
    private _readable: boolean = true;
    private _unsafe  : boolean = false;

    public get values(): Map<int, T> {
        if (this._readable !== true) return new Map();
        return this._values;
    }
    public get length(): int {
        if (this._readable !== true) return 0;
        return this._length();
    }

    public get space(): Spaces {
        return this._space;
    }

    /**
     * Alias for `isReadonly`
     */
    public get isStatic(): boolean {
        return this._static;
    }
    public get isReadonly(): boolean {
        return this._static;
    }
    public get isReadable(): boolean {
        return this._readable;
    }
    public get unsafeAllowed(): boolean {
        return this._unsafe;
    }

    constructor(
        ...values: T[]
    ) {
        for (let i = 0; i < values.length; i++) {
            this._values.set(i, values[i]);
        }
    }

    public setSpace(space: Spaces) {
        this._space = space;
        return this;
    }

    public allowUnsafe(state?: boolean) {
        if (state === undefined) this._unsafe = true;
        else this._unsafe = state;
        return this;
    }

    /**
     * Alias for `allowUnsafe()`
     */
    public unsafe(state?: boolean) {
        return this.allowUnsafe(state);
    }

    /**
     * Alias for `immutable()`
     */
    public static(state?: boolean) {
        return this.immutable(state);
    }
    /**
     * Alias for `immutable()`
     */
    public readonly(state?: boolean) {
        return this.immutable(state);
    }
    /**
     * Alias for `immutable()`
     */
    public imut(state?: boolean) {
        return this.immutable(state);
    }
    /**
     * Alias for `mutable()`
     */
    public mut(state?: boolean) {
        return this.mutable(state);
    }


    public immutable(state?: boolean) {
        if (state === undefined) this._static = true;
        else this._static = state;
        return this;
    }
    public mutable(state?: boolean) {
        if (state === undefined) this._static = false;
        else this._static = !state;
        return this;
    }

    public readable(state?: boolean) {
        if (this._unsafe !== true) return this;

        if (state === undefined) this._readable = true;
        else this._readable = state;
        return this;
    }
    // operations

    public add(value: T) {
        if (this._static === true) return;
        this._values.set(this.length, value);
    }

    // public remove(value: T) { }

    // public set(k: string, v: T) { }

    public get(k?: string) {
        if (this._readable !== true) return null;
        if (k === undefined) return this.getIdx(0);

        const m = this.map();
        return m[k];
    }

    public getIdx(idx?: int): T | null | undefined {
        if (this._readable !== true) return null;
        if (idx === undefined) idx = 0;

        return this._values.get(idx);
    }

    // unsafe operations
    public set(label: string|T, value?: T) {
        if (this._static === true) return;
        if (this._unsafe !== true) return;

// @ts-ignore
        if (value === undefined) return this.setIdx(0, label);

        const idxMap = this.idxMap();
// @ts-ignore
        const find = findMap(idxMap, 'label', label);

        this._values.set(find, value);
        return this;
    }

    public setIdx(idx: int|T, value: T): void {
        if (this._static === true) return;
        if (this._unsafe !== true) return;
        if (value === undefined) return this.setIdx(0, idx);
        this._values.set(idx, value);
    }


    public remove(label?: string) {
        if (this._static === true) return;
        if (this._unsafe !== true) return;

// @ts-ignore
        if (label === undefined) return this.removeIdx(0);

        const idxMap = this.idxMap();
        const find = findMap(idxMap, 'label', label);
        this._values.delete(find);
        return this;
    }

    public removeIdx(idx?: int) {
        if (this._static === true) return;
        if (this._unsafe !== true) return;
        if (idx === undefined) idx = 0;
        this._values.delete(idx);
    }

    // utils
    public idxMap(space: Spaces = this._space): { idx: number, label: string, value: T}[] {
        if (this._readable !== true) return [];

        let arr: { idx: number, label: string, value: T}[] = [];
        const v: T[] = this.toArray();

        if (space === Spaces.VEC) {
            if (this.length === 1) space = Spaces.VEC1;
            if (this.length === 2) space = Spaces.VEC2;
            if (this.length === 3) space = Spaces.VEC3;
            if (this.length === 4) space = Spaces.VEC4;
        }

        if (space === Spaces.SINGLE) space = Spaces.VEC1;
        if (space === Spaces.QUATERNION) space = Spaces.VEC4;

        if (space === Spaces.RGB) {
            arr.push({ idx: 0, label: "r", value: v[0]});
            arr.push({ idx: 1, label: "g", value: v[1] });
            arr.push({idx: 2, label: 'b', value: v[2]});
        }
        if (space === Spaces.RGBA) {
            arr.push({idx: 0, label: "r", value: v[0]});
            arr.push({idx: 1, label: "g", value: v[1]});
            arr.push({idx: 2, label: 'b', value: v[2]});
            arr.push({idx: 3, label: 'a', value: v[3]});
        }

        if (space === Spaces.VEC1) {
            arr.push({ idx: 0, label: "x", value: v[0] });
        }

        if(space === Spaces.VEC2) {
            arr.push({ idx: 0, label: "x", value: v[0] });
            arr.push({ idx: 1, label: "y", value: v[1] });
        }
        if(space === Spaces.VEC3) {
            arr.push({ idx: 0, label: "x", value: v[0] });
            arr.push({ idx: 1, label: "y", value: v[1] });
            arr.push({ idx: 2, label: "z", value: v[2] });
        }
        if(space === Spaces.VEC4) {
            arr.push({ idx: 0, label: "x", value: v[0] });
            arr.push({ idx: 1, label: "y", value: v[1] });
            arr.push({ idx: 2, label: "z", value: v[2] });
            arr.push({ idx: 3, label: "w", value: v[3] });
        }

        if(space === Spaces.ALPHABET) {
            for (let i = 0; i < v.length; i++) {
                // 0) [ALPHABET[1]] = v[1]:
                arr.push({ idx: i, label: genLabelByIdx(i), value: v[i] });
            }
            return arr;
        }

        return arr;
    }

    public toArray(): T[] {
        if (this._readable !== true) return [];

        let arr: T[] = []
        this.values.forEach((v: T, k: int, m) => {
            arr.push(v)
        });
        return arr;
    };

    public map(space?: Spaces): {[key: string]: T} {
        if (this._readable !== true) return {};

        if (space === undefined) space = this._space;

        const v: T[] = this.toArray();
        if (space === Spaces.VEC) {
            if (this.length === 1) space = Spaces.VEC1;
            if (this.length === 2) space = Spaces.VEC2;
            if (this.length === 3) space = Spaces.VEC3;
            if (this.length === 4) space = Spaces.VEC4;
        }
        if (space === Spaces.SINGLE) space = Spaces.VEC1;
        if (space === Spaces.QUATERNION) space = Spaces.VEC4;

        if (space === Spaces.RGB) return { r: v[0], g: v[1], b: v[2] };
        if (space === Spaces.RGBA) return { r: v[0], g: v[1], b: v[2], a: v[3] };
        if (space === Spaces.VEC1) return { x: v[0] };
        if (space === Spaces.VEC2) return { x: v[0], y: v[1] };
        if (space === Spaces.VEC3) return { x: v[0], y: v[1], z: v[2] };
        if (space === Spaces.VEC4) return { x: v[0], y: v[1], z: v[2], w: v[3] };
        if (space === Spaces.ALPHABET) {
            let obj: {[key: string]: T} = {};
            for (let i = 0; i < v.length; i++) {
                obj[genLabelByIdx(i)] = v[i];
            }
            return obj;
        }

        return {};
    }

    public clone() {
        return new Vec<T>(...(this.toArray()))
            .static(this._static)
            .allowUnsafe(this._unsafe)
            .readable(this._readable);
    }

    public toString(inheritParentProps: boolean = false): VecString {

        if (inheritParentProps === true)
            return `__ivec${JSON.stringify(this.toArray())}`;
        if (this._static === true && this._unsafe === true)
            return `__suvec${JSON.stringify(this.toArray())}`;
        else if (this._static === true)
            return `__svec${JSON.stringify(this.toArray())}`;
        else if (this._unsafe === true)
            return `__uvec${JSON.stringify(this.toArray())}`;

// @ts-expect-error
        else if((this._readable !== true) && this._static === true && this._unsafe === true)
            return '__suevec[]';

// @ts-expect-error
        else if((this._readable !== true) && this._static === true)
            return '__sevec[]';

// @ts-expect-error
        else if((this._readable !== true) && this._unsafe === true)
            return '__uevec[]';
        else if(this._readable !== true)
            return '__evec[]';
        else
            return `__vec${JSON.stringify(this.toArray())}`;
    }

    public fromArray(values: T[]): this {
        if (this._static === true) return this;
        if (this._unsafe !== true) return this;
        for (let i = 0; i < values.length; i++) {
            this.setIdx(i, values[i]);
        }
        return this;
    }

    public fromString(str: string): this {
        if (!(
            str.startsWith('__vec') ||
            str.startsWith('__svec') ||
            str.startsWith('__uvec') ||
            str.startsWith('__suvec') ||
            str.startsWith('__ivec') ||
            str.startsWith('__evec') ||
            str.startsWith('__sevec') ||
            str.startsWith('__uevec') ||
            str.startsWith('__suevec')
        )) return this;
        /** */
        let oUnsafe: boolean = false;
        let oStatic: boolean = false;

        if (this._unsafe === true) oUnsafe = true;
        if (this._static === true) oStatic = true;

        /** */
        let type: VecTypes = VecTypes.VEC;
        let arrStr: string = '';
        let arr: T[] = [];

        /** */
        this.readonly(false);
        this.allowUnsafe(true);
        if (str.startsWith('__vec')) type = VecTypes.VEC;
        if (str.startsWith('__svec')) type = VecTypes.SVEC;
        if (str.startsWith('__uvec')) type = VecTypes.UVEC;
        if (str.startsWith('__suvec')) type = VecTypes.SUVEC;
        if (str.startsWith('__ivec')) type = VecTypes.IVEC;
        if (str.startsWith('__evec')) type = VecTypes.EVEC;
        if (str.startsWith('__sevec')) type = VecTypes.SEVEC;
        if (str.startsWith('__uevec')) type = VecTypes.UEVEC;
        if (str.startsWith('__suevec')) type = VecTypes.SUEVEC;
        arrStr = str.replace(type, '');
        arr = JSON.parse(arrStr);

        this.fromArray(arr);

        switch (type) {
            case VecTypes.VEC:
                this.readonly(false);
                this.allowUnsafe(false);
                break;
            case VecTypes.UVEC:
                this.allowUnsafe(true);
                this.static(false);
                break;
            case VecTypes.SVEC:
                this.allowUnsafe(false);
                this.static(true);
                break;
            case VecTypes.SUVEC:
                this.allowUnsafe(true);
                this.static(true);
                break;
            case VecTypes.IVEC:
                this.readonly(oStatic);
                this.allowUnsafe(oUnsafe);
                break;
            case VecTypes.EVEC:
                this.readable(false);
                this.readonly(false);
                this.allowUnsafe(false);
                break;
            case VecTypes.UEVEC:
                this.readable(false);
                this.allowUnsafe(true);
                this.static(false);
                break;
            case VecTypes.SEVEC:
                this.readable(false);
                this.allowUnsafe(false);
                this.static(true);
                break;
            case VecTypes.SUEVEC:
                this.readable(false);
                this.allowUnsafe(true);
                this.static(true);
                break;
        }

        return this;
    }
}