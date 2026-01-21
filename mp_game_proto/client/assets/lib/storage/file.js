import * as fs from 'node:fs';
import * as path from 'node:path';
export class Files {
    filePath;
    cookiePrefix = "";
    clusterPrefix = "";
    store = {};
    /**
     *
     * @param {String} clusterPrefix
     */
    constructor(filePath = "./db.json", clusterPrefix) {
        this.filePath = filePath;
        if (clusterPrefix !== undefined)
            this.clusterPrefix = clusterPrefix;
    }
    Load() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                this.store = JSON.parse(data);
            }
        }
        catch (e) {
            console.error('Error loading file store:', e);
        }
    }
    Save() {
        try {
            const data = JSON.stringify(this.store, null, 2);
            fs.writeFileSync(this.filePath, data, 'utf-8');
        }
        catch (e) {
            console.error('Error saving file store:', e);
        }
    }
    State() { }
    Delete(cname) {
        delete this.store[cname];
    }
    /**
     *
     * @param {string} cname
     * @param {string} cvalue
     * @param {number} exdays
     */
    Set(cname, cvalue, exdays) {
        this.store[cname] = cvalue;
    }
    /**
     *
     * @param {string} cname
     * @returns {string}
     */
    Get(cname) {
        return this.store[cname] ?? "";
    }
    /**
     *
     * @param {string} cname
     * @returns {boolean}
     */
    Check(cname) {
        return cname in this.store;
    }
    /**
     *
     * @param {string} cname
     * @param {string} cvalue
     * @returns {{state:boolean, meta: {cname:string,cvalue:string}}}
     */
    CheckIf(cname, cvalue) {
        const state = (this.store[cname] === cvalue);
        return {
            state,
            meta: { cname, cvalue }
        };
    }
    /**
     *
     * @param {string} cname
     * @param {string} cvalue
     * @param {(state:boolean, meta: {cname:string,cvalue:string}) => void} callback
     */
    CheckIfCB(cname, cvalue, callback) {
        const state = (this.store[cname] === cvalue);
        callback(state, { cname, cvalue });
    }
}
