export class Cookies {
    cookiePrefix = "cookie_";
    clusterPrefix = "";
    /**
     *
     * @param {String} clusterPrefix
     */
    constructor(clusterPrefix) {
        if (clusterPrefix !== undefined)
            this.clusterPrefix = clusterPrefix;
        if (this.State() === false) {
            alert(`You have turned off the cookies.
however, in the current state, this will cause major bugs.`);
            sessionStorage.setItem("cookiesDisabled", "false");
        }
    }
    State() {
        if (sessionStorage.getItem("cookiesDisabled") === "true")
            return false;
        else
            return true;
    }
    Delete(cname) {
        cname = this.clusterPrefix + cname;
        if (this.State() == false) {
            return localStorage.removeItem(`${this.cookiePrefix}${cname}`);
        }
        else {
            cookieStore.delete(cname);
        }
    }
    /**
     *
     * @param {string} cname
     * @param {string} cvalue
     * @param {number} exdays
     */
    Set(cname, cvalue, exdays) {
        cname = this.clusterPrefix + cname;
        if (this.State() == false) {
            return localStorage.setItem(`${this.cookiePrefix}${cname}`, cvalue);
        }
        else {
            const d = new Date();
            if (exdays == undefined)
                exdays = 30;
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            let expires = "expires=" + d.toUTCString();
            return document.cookie =
                cname + "=" + cvalue + ";" + expires + ";path=/;"; //+ "secure=true;";
        }
    }
    /**
     *
     * @param {string} cname
     * @returns {string}
     */
    Get(cname) {
        cname = this.clusterPrefix + cname;
        if (this.State() == false) {
            const _ = localStorage.getItem(`${this.cookiePrefix}${cname}`);
            return _ === null ? "null" : _;
        }
        else {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(";");
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == " ") {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    }
    /**
     *
     * @param {string} cname
     * @returns {boolean}
     */
    Check(cname) {
        let cookie = this.Get(cname);
        if (cookie == "" || cookie == undefined || cookie == null) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     *
     * @param {string} cname
     * @param {string} cvalue
     * @returns {{state:boolean, meta: {cname:string,cvalue:string}}}
     */
    CheckIf(cname, cvalue) {
        if (this.Get(cname) == cvalue)
            return { state: true, meta: { cname, cvalue } };
        else
            return { state: false, meta: { cname, cvalue } };
    }
    /**
     *
     * @param {string} cname
     * @param {string} cvalue
     * @param {(state:boolean, meta: {cname:string,cvalue:string}) => void} callback
     */
    CheckIfCB(cname, cvalue, callback) {
        if (this.Get(cname) == cvalue)
            callback(true, { cname, cvalue });
        else
            callback(false, { cname, cvalue });
    }
}
