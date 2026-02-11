import { Driver } from "../types.js";
export class MemoryDriver {
    _tablePrefix = "";
    M;
    StoreSet = new Set();
    Store = {};
    get tablePrefix() {
        return this._tablePrefix;
    }
    constructor() {
        this.M = new Map();
    }
    SetPrefix(prefix) {
        try {
            this._tablePrefix = prefix;
            return 'OK';
        }
        catch (e) {
            return new Error('Failed setting prefix', { cause: e });
        }
    }
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //     
    /**
     * @deprecated
     *
     * This does absolutely nothing in this driver
     */
    Save() {
        try {
            return 'OK';
        }
        catch (e) {
            return new Error('Failed saving', { cause: e });
        }
    }
    /**
     * @deprecated
     *
     * This does absolutely nothing in this driver
     */
    Load() {
        try {
            return 'OK';
        }
        catch (e) {
            return new Error('Failed loading', { cause: e });
        }
    }
    _Save() {
        try {
            // this.C.Set("store", JSON.stringify(this.Store), 36500);
            for (const k in this.Store) {
                this.M.set(k, this.Store[k]);
            }
            return 'OK';
        }
        catch (e) {
            return new Error('Failed saving', { cause: e });
        }
    }
    _Load() {
        try {
            // this.Store = JSON.parse(this.C.Get("store"));
            this.M.forEach((v, k, _) => {
                this.Store[k] = v;
            });
            return 'OK';
        }
        catch (e) {
            return new Error('Failed loading', { cause: e });
        }
    }
    _Set(k, v) {
        try {
            this.Store[k] = v;
            const Save_Res = this._Save();
            if (Save_Res !== 'OK')
                throw Save_Res;
            if (this.Store[k] === v)
                return 'OK';
            else
                throw 'could complete the check to see if the value actually ended up in the store.';
        }
        catch (e) {
            return new Error('Failed setting', { cause: e });
        }
    }
    _Get(k) {
        try {
            return this.Store[k];
        }
        catch (e) {
            return new Error('Failed getting', { cause: e });
        }
    }
    _Delete(k) {
        try {
            delete this.Store[k];
            const Save_Res = this._Save();
            if (Save_Res !== 'OK')
                throw Save_Res;
            return 'OK';
        }
        catch (e) {
            return new Error('Failed deleting', { cause: e });
        }
    }
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
    Set(k, v) {
        try {
            this.M.set(k, v);
            if (this.M.get(k) === v)
                return 'OK';
            else
                throw 'could complete the check to see if the value actually ended up in the store.';
        }
        catch (e) {
            return new Error('Failed setting', { cause: e });
        }
    }
    Get(k) {
        try {
            return this.M.get(k);
        }
        catch (e) {
            return new Error('Failed getting', { cause: e });
        }
    }
    Delete(k) {
        try {
            this.M.delete(k);
            return 'OK';
        }
        catch (e) {
            return new Error('Failed deleting', { cause: e });
        }
    }
}
