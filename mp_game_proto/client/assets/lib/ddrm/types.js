export class TypeCheck {
    handler;
    constructor(handler) {
        this.handler == undefined
            ? (this.handler = console.log)
            : (this.handler = handler);
    }
    numSync(inp) {
        if (typeof inp == "number")
            return inp;
        else {
            console.log(new Error(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`));
            return null;
        }
    }
    boolSync(inp) {
        if (typeof inp == "boolean")
            return inp;
        else {
            console.log(new Error(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`));
            return null;
        }
    }
    funcSync(inp) {
        if (typeof inp == "function")
            return inp;
        else {
            console.log(new Error(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`));
            return null;
        }
    }
    objeSync(inp) {
        if (typeof inp == "object")
            return inp;
        else {
            console.log(new Error(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`));
            return null;
        }
    }
    striSync(inp) {
        if (typeof inp == "string")
            return inp;
        else {
            console.log(new Error(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`));
            return null;
        }
    }
    TypeOfSync(type, inp) {
        if (typeof inp == type)
            return inp;
        else {
            console.log(new Error(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`));
            return null;
        }
    }
}
export class TypeCheckAsync extends TypeCheck {
    constructor(handler) {
        super(handler);
    }
    async num(inp) {
        return new Promise((res, rej) => {
            if (typeof inp == "number")
                res(inp);
            else
                rej(`<[ERROR]: Expected TypeOf input to be 'number' but got ${typeof inp}>`);
        });
    }
    async bool(inp) {
        return new Promise((res, rej) => {
            if (typeof inp == "boolean")
                res(inp);
            else
                rej(`<[ERROR]: Expected TypeOf input to be 'boolean' but got ${typeof inp}>`);
        });
    }
    async func(inp) {
        return new Promise((res, rej) => {
            if (typeof inp == "function")
                res(inp);
            else
                rej(`<[ERROR]: Expected TypeOf input to be 'function' but got ${typeof inp}>`);
        });
    }
    async obje(inp) {
        return new Promise((res, rej) => {
            if (typeof inp == "object")
                res(inp);
            else
                rej(`<[ERROR]: Expected TypeOf input to be 'object' but got ${typeof inp}>`);
        });
    }
    async stri(inp) {
        return new Promise((res, rej) => {
            if (typeof inp == "string")
                res(inp);
            else
                rej(`<[ERROR]: Expected TypeOf input to be 'string' but got ${typeof inp}>`);
        });
    }
    async TypeOf(type, inp) {
        return new Promise((res, rej) => {
            if (typeof inp == type)
                res(inp);
            else
                rej(`<[ERROR]: Expected TypeOf input to be '${type}' but got ${typeof inp}>`);
        });
    }
    custom = {
        gender: async (input) => {
            return new Promise((resolve, reject) => {
                if (typeof input === "boolean" || input === null) {
                    // resolve(input)
                    if (input === true)
                        resolve({ _: "woman", raw: true });
                    if (input === false)
                        resolve({ _: "man", raw: false });
                    if (input === null)
                        resolve({ _: "other", raw: null });
                    else
                        reject(`<[ERROR]: Expected TypeOf input to be one of <boolean|null> but got ${typeof input}>`);
                }
                else
                    reject(`<[ERROR]: Expected TypeOf input to be one of <boolean|null> but got ${typeof input}>`);
            });
        },
    };
}
export class Extra extends TypeCheckAsync {
    constructor(handler) {
        super(handler);
    }
    async void(params, silent) {
        let res = [];
        if (Array.isArray(params)) {
            params.forEach(async (task, index) => {
                const resp = eval(await exec(task));
                if (silent === false)
                    console.info(index, "|", resp);
                return res.push(resp);
            });
            return res;
        }
        else {
            res = eval(await exec(params));
            if (silent === false)
                console.info("single", "|", res);
            return res;
        }
        async function exec(input) {
            // console.log(`${input}`)
            // if (typeof input === "function" && `${input}`.startsWith("async")) return await input();
            if (typeof input === "function")
                return input();
            else if (typeof input === "string")
                return `'${input}'`;
            else
                return input;
        }
    }
}
const jsTypes = Extra;
export default jsTypes;
