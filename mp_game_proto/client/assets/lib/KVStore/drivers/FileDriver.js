import { Driver } from "../types.js";
import { Files } from "../../storage/file.js";
const PREFIX = "KVSTORE.";
const EQ_CHAR = "©EQ©";
const SYS_CHAR = "©§©";
/** @enum */
const SYS_CODES = {
    DELETE: "0x01"
};
export class FileDriver {
    _PREFIX = PREFIX;
    C;
    StoreSet = new Set();
    Store = {};
    get tablePrefix() {
        return this._PREFIX;
    }
    constructor(filePath) {
        this.C = new Files(filePath);
    }
    SetPrefix(prefix) {
        try {
            if (prefix !== "")
                this._PREFIX = prefix + PREFIX;
            return 'OK';
        }
        catch (e) {
            return new Error('Failed setting prefix', { cause: e });
        }
    }
    Save(TIME = 36500) {
        try {
            // this.C.Set("store", JSON.stringify(this.Store), 36500);
            for (const k in this.Store) {
                if (this.Store[k] === SYS_CHAR + SYS_CODES.DELETE) {
                    this.C.Delete(this._PREFIX + k);
                    this.C.Delete("JSON_" + this._PREFIX + k);
                }
                else if (typeof this.Store[k] === 'object' || Array.isArray(this.Store[k]))
                    this.C.Set("JSON_" + this._PREFIX + k, JSON.stringify(this.Store[k]), TIME);
                else
                    this.C.Set(this._PREFIX + k, this.Store[k], TIME);
            }
            this.C.Save();
            return 'OK';
        }
        catch (e) {
            return new Error('Failed saving', { cause: e });
        }
    }
    Load() {
        try {
            // this.C.Set("store", JSON.stringify(this.Store), 36500)
            // this.Store = JSON.parse(this.C.Get("store"));
            // const c_split = document.cookie.split("; ");
            // for (const c of c_split) {
            //     const [k,v] = c.split("=");
            //     if (k.startsWith("JSON_"+this._PREFIX))
            //         this.Store[(k.replace("JSON_"+this._PREFIX, ""))] = JSON.parse(v);
            //     else if (k.startsWith(this._PREFIX))
            //         this.Store[(k.replace(this._PREFIX, ""))] = v;
            //     else continue;
            // }
            this.C.Load();
            const STORE = this.C.store;
            for (const k in STORE) {
                if (k.startsWith("JSON_" + this._PREFIX))
                    this.Store[(k.replace("JSON_" + this._PREFIX, ""))] = JSON.parse(STORE[k]);
                else if (k.startsWith(this._PREFIX))
                    this.Store[(k.replace(this._PREFIX, ""))] = STORE[k];
                else
                    continue;
            }
            return 'OK';
        }
        catch (e) {
            return new Error('Failed loading', { cause: e });
        }
    }
    Set(k, v) {
        try {
            if (String(v).includes("="))
                v = String(v).replaceAll("=", EQ_CHAR);
            this.Store[k] = v;
            const Save_Res = this.Save();
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
    Get(k) {
        try {
            let r = this.Store[k];
            if (String(r).includes(EQ_CHAR))
                r = String(r).replaceAll(EQ_CHAR, "=");
            return r;
        }
        catch (e) {
            return new Error('Failed getting', { cause: e });
        }
    }
    Delete(k) {
        try {
            this.Store[k] = SYS_CHAR + SYS_CODES.DELETE;
            const Save_Res = this.Save();
            if (Save_Res !== 'OK')
                throw Save_Res;
            return 'OK';
        }
        catch (e) {
            return new Error('Failed deleting', { cause: e });
        }
    }
}
