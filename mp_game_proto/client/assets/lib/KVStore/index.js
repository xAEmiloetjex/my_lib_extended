import { Driver } from "./types.js";
// import { CookieDriver } from "./drivers/CookieDriver";
import { MemoryDriver } from "./drivers/MemoryDriver.js";
//# .LIB_KVSTORE
export class KVStore {
    Driver;
    tablePrefix;
    constructor(opts = {
        Driver: new MemoryDriver(),
        tablePrefix: ""
    }) {
        if (opts && opts.Driver)
            this.Driver = opts.Driver;
        else
            this.Driver = new MemoryDriver();
        if (opts && opts.tablePrefix)
            this.tablePrefix = opts.tablePrefix;
        else
            this.tablePrefix = "";
        this.Driver.SetPrefix(this.tablePrefix);
        this.Driver.Load();
    }
    set(k, v) {
        const val = this.Driver.Set(k, v);
        // this.Driver.Save();
        return val;
    }
    get(k) {
        return this.Driver.Get(k);
    }
    delete(k) {
        const val = this.Driver.Delete(k);
        // this.Driver.Save();
        return val;
    }
}
