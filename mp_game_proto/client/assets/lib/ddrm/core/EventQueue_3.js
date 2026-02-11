import { mkRandStr2 as mkrand_, removeFromArray, UniqueGen } from "./utils/common";
import { HEX_CHAR_LIST } from "./types/constants_1";
import { Logger } from "../logger";
import {} from "../types";
// import { EventQueue as EV_V2 } from "./EventQueue_2_1";
import { EventEmitter2, EventEmitter3 } from "../Events";
export var HandlerStatus;
(function (HandlerStatus) {
    HandlerStatus[HandlerStatus["Ok"] = 0] = "Ok";
    HandlerStatus[HandlerStatus["Error"] = 1] = "Error";
    HandlerStatus[HandlerStatus["Global"] = 2] = "Global";
    HandlerStatus[HandlerStatus["Children"] = 3] = "Children";
    HandlerStatus[HandlerStatus["Unknown"] = 4] = "Unknown";
})(HandlerStatus || (HandlerStatus = {}));
export var LogLevels;
(function (LogLevels) {
    LogLevels[LogLevels["Silent"] = 0] = "Silent";
    LogLevels[LogLevels["Normal"] = 1] = "Normal";
    LogLevels[LogLevels["Verbose"] = 2] = "Verbose";
})(LogLevels || (LogLevels = {}));
export var ResponseLevels;
(function (ResponseLevels) {
    ResponseLevels[ResponseLevels["Normal"] = 0] = "Normal";
    ResponseLevels[ResponseLevels["Verbose"] = 1] = "Verbose";
})(ResponseLevels || (ResponseLevels = {}));
const colorHandler = {
    blue: (inp) => inp,
    yellow: (inp) => inp,
    red: (inp) => inp,
    green: (inp) => inp,
    magenta: (inp) => inp,
};
/**
 * @DEV
 ```ts
let _glob_ = {};

_glob_["alt_evQueue"] = {};
_glob_["alt_evQueue"]["constants"] = {
  EMIT_REMOVE_TIMEOUT: 100,
  GLOBAL_QUEUE_SYNC_TIMEOUT: 100,
  INTERNAL_GLOB_SYNC_OFFSET: 5,
};
// _glob_["alt_evQueue"]["on"] = new Map<string, IEvHandlerFunc[]>();
// _glob_["alt_evQueue"]["once"] = new Map<string, IEvHandlerFunc[]>();
_glob_["alt_evQueue"]["queue"] = new Map<string, RestrictiveAny[]>();
_glob_["alt_evQueue"]["queue_"] = [];

_glob_["globExecState"] = new Map<string, RestrictiveAny[]>();

_glob_["stores"] = {};
```
*/
function _glob_DEV() { }
let _glob_ = {
    alt_evQueue: {
        constants: {
            EMIT_REMOVE_TIMEOUT: 100,
            GLOBAL_QUEUE_SYNC_TIMEOUT: 100,
            INTERNAL_GLOB_SYNC_OFFSET: 5,
        },
        queue: new Map(),
        queue_: []
    },
    globExecState: new Map(),
    stores: {},
    openStores: {}
};
// _glob_["alt_evQueue"]["on"] = new Map<string, IEvHandlerFunc[]>();
// _glob_["alt_evQueue"]["once"] = new Map<string, IEvHandlerFunc[]>();
const DEFAULTS = {
    LOGLEVEL: LogLevels.Normal,
    RESPLEVEL: ResponseLevels.Normal,
};
/**
 * @function SyncLoop
 *
 * Used to synchronize the global queues into one main global queue
 */
function SyncLoop() {
    return setInterval(() => {
        const queues = _glob_.alt_evQueue.queue;
        // const main: RestrictiveAny[] = _glob_["alt_evQueue"]["queue_"]
        const __ = [];
        queues.forEach((v, _k) => {
            v.forEach((v_) => __.push(v_));
        });
        _glob_.alt_evQueue.queue_ = __;
    }, _glob_.alt_evQueue.constants.GLOBAL_QUEUE_SYNC_TIMEOUT);
}
function mkRandStr2(length_, charlist) {
    return UniqueGen((length) => mkrand_(length, charlist), length_);
}
/**
 * The back-end of the EventEmitter3 class,
 * Usually it's not recommended to interact with this directly
 * since the EventEmitter3 class is there to provide a fixed layout to this class that may change majorly over time
 */
export class EventQueue {
    instanceId = mkRandStr2(8, HEX_CHAR_LIST);
    queue = [];
    // public abstract AbstractionClass;
    parents = [];
    children = [];
    globQueue = [];
    executedGlobals = [];
    handlers = new Map();
    oneTimeHandlers = new Map();
    _logger_ = new Logger("EventEmitter_v2", console, colorHandler);
    logLevel = DEFAULTS.LOGLEVEL;
    respLevel = DEFAULTS.RESPLEVEL;
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
    }
    setResponseLevel(respLevel) {
        this.respLevel = respLevel;
    }
    appendNewLogger(loggerClass) {
        return (this._logger_ = loggerClass);
    }
    // public setParents(parents: TChildrenEmitters[]) {}
    addParent(parent) {
        if (this.children.includes(parent))
            throw new Error('You tried to make a child of this instance a parent of this instance, this is not allowed');
        this.parents.push(parent);
    }
    setChildren(children, parent) {
        for (const child of children) {
            child.addParent(parent);
            if (this.parents.includes(child))
                throw new Error('You tried to make one of this instances parents their child, this is not allowed');
        }
        return this.children = children;
    }
    addChild(child, parent) {
        if (this.parents.includes(child))
            throw new Error('You tried to make one of this instances parents their child, this is not allowed');
        child.addParent(parent);
        // return this.children = [...(this.children || []), child]
        return this.children.push(child);
    }
    constructor() {
        _glob_.stores[this.instanceId] = {};
        // _glob_["stores"][this.instanceId]["execGlobs"] = {}
        // setInterval(() => {
        //   this.globQueue = _glob_["alt_evQueue"]["queue_"];
        //   this.executedGlobals = [];
        // }, _glob_.alt_evQueue.constants.GLOBAL_QUEUE_SYNC_TIMEOUT + _glob_.alt_evQueue.constants.INTERNAL_GLOB_SYNC_OFFSET);
        const { GLOBAL_QUEUE_SYNC_TIMEOUT, INTERNAL_GLOB_SYNC_OFFSET } = _glob_.alt_evQueue.constants;
        setInterval(() => {
            this.globQueue = [..._glob_.alt_evQueue.queue_]; // Creates a shallow copy to prevent unintended mutations
            this.executedGlobals.length = 0; // Resets the array more efficiently
        }, GLOBAL_QUEUE_SYNC_TIMEOUT + INTERNAL_GLOB_SYNC_OFFSET);
        setInterval(() => {
            if (this.globQueue.length < 1)
                return;
            else {
                const obj = this.globQueue[this.globQueue.length - 1];
                const { emitId, name, data } = obj;
                if (this.logLevel != LogLevels.Silent)
                    this._logger_.warn("Globals are experimental!");
                // if (this.logLevel == LogLevels.verbose)
                //   this._logger_.debug({
                //     globStores: _glob_["stores"],
                //     isAlreadyInExecGlobs: this.getStore("execGlobs", obj)._result,
                //     obj,
                //   })
                if (this.getStore("execGlobs", obj)._result == false) {
                    let stateHolder = [];
                    if (_glob_.globExecState.has(emitId))
                        stateHolder = _glob_.globExecState.get(emitId) ?? [];
                    const ___ = this.Handle(name, data);
                    stateHolder.push(___);
                    _glob_.globExecState.set(emitId, stateHolder);
                    if (___.status == HandlerStatus.Error) {
                        this._logger_.error("EventHandlerError", ___);
                    }
                }
                this.globQueue.pop();
                // this.executedGlobals.push(obj);
                this.pushStore("execGlobs", obj);
            }
        }, 0);
    }
    pushStore(name, data) {
        if (!_glob_.stores[this.instanceId][name])
            _glob_.stores[this.instanceId][name] = {};
        const _in = { ..._glob_.stores[this.instanceId][name] };
        let _out = _in;
        _out[JSON.stringify(data)] = true;
        _glob_.stores[this.instanceId][name] = _out;
        return {
            _out,
            store: _glob_.stores[this.instanceId][name],
        };
    }
    getStore(name, data) {
        if (!_glob_.stores[this.instanceId][name])
            _glob_.stores[this.instanceId][name] = {};
        const _in = { ..._glob_.stores[this.instanceId][name] };
        let _out = _in;
        let _result = _out[JSON.stringify(data)] !== undefined
            ? _out[JSON.stringify(data)]
            : false;
        return {
            _result,
            _out,
            store: _glob_.stores[this.instanceId][name],
        };
    }
    removeStore(name, data) {
        if (!_glob_.stores[this.instanceId][name])
            _glob_.stores[this.instanceId][name] = {};
        const _in = { ..._glob_.stores[this.instanceId][name] };
        let _out = _in;
        delete _out[JSON.stringify(data)];
        _glob_.stores[this.instanceId][name] = _out;
        return {
            _out,
            store: _glob_.stores[this.instanceId][name],
        };
    }
    openStore = {
        push(name, data) {
            if (!_glob_.openStores[this.instanceId][name])
                _glob_.openStores[this.instanceId][name] = {};
            const _in = { ..._glob_.openStores[this.instanceId][name] };
            // Will fix later
            let _out /* Will fix later */ = _in;
            _out[JSON.stringify(data)] = true;
            _glob_.openStores[this.instanceId][name] = _out;
            return {
                _out,
                store: _glob_.openStores[this.instanceId][name],
            };
        },
        get(name, data) {
            if (!_glob_.openStores[this.instanceId][name])
                _glob_.openStores[this.instanceId][name] = {};
            const _in = { ..._glob_.openStores[this.instanceId][name] };
            let _out = _in;
            let _result = _out[JSON.stringify(data)] !== undefined
                ? _out[JSON.stringify(data)]
                : false;
            return {
                _result,
                _out,
                store: _glob_.openStores[this.instanceId][name],
            };
        },
        remove(name, data) {
            if (!_glob_.openStores[this.instanceId][name])
                _glob_.openStores[this.instanceId][name] = {};
            const _in = { ..._glob_.openStores[this.instanceId][name] };
            let _out /* Will fix later */ = _in;
            delete _out[JSON.stringify(data)];
            _glob_.openStores[this.instanceId][name] = _out;
            return {
                _out,
                store: _glob_.openStores[this.instanceId][name],
            };
        }
    };
    logGlob() {
        console.log(_glob_);
    }
    /**
     * The `index` property is just an estimate
     */
    addSingleUseListener(name, handler) {
        const ListenerId = mkRandStr2(16, HEX_CHAR_LIST);
        let handlers /* Will fix later */ = [];
        // if (name.startsWith("global::")) {
        //   // if (this.logLevel != LogLevels.silent) this._logger_.warn("Globals are experimental!")
        //   // if (_glob_["alt_evQueue"]["once"].has(name))
        //   //   handlers = _glob_["alt_evQueue"]["once"].get(name);
        //   // handlers.push({ handler });
        //   // _glob_["alt_evQueue"]["once"].set(name, handlers);
        //   this._logger_.warn(
        //     "singleUse listeners are bugged in the global scope.\n",
        //     "however they are not in the local scope,\n",
        //     "to preserve your listener it's still available locally.\n",
        //     "if you want a listener to be single use in the global scope,\n",
        //     "You will have to manually block execution after the first time, a simple if statement can provide this\n",
        //     "Example:\n\n",
        //     "var singleUseHandlerState = false\n",
        //     "eventEmitter.on(\'global::EventName\', () => {\n",
        //     "   singleUseHandlerState = true;\n",
        //     "   console.log(\'Hello, World!\');\n",
        //     "});"
        //   )
        // } //else {
        if (this.oneTimeHandlers.has(name))
            handlers = this.oneTimeHandlers.get(name);
        handlers.push({ ListenerId, handler });
        this.oneTimeHandlers.set(name, handlers);
        return {
            name,
            handler,
            ListenerId,
            index: handlers.length
        };
        //}
    }
    /**
   * The `index` property is just an estimate
   */
    addListener(name, handler) {
        const ListenerId = mkRandStr2(16, HEX_CHAR_LIST);
        let handlers /* Will fix later */ = [];
        // if (name.startsWith("global::")) {
        //   if (this.logLevel != LogLevels.silent) this._logger_.warn("Globals are experimental!")
        //   if (_glob_["alt_evQueue"]["on"].has(name))
        //     handlers = _glob_["alt_evQueue"]["on"].get(name);
        //   handlers.push({ ListenerId, handler });
        //   _glob_["alt_evQueue"]["on"].set(name, handlers);
        // } else {
        if (this.handlers.has(name))
            handlers = this.handlers.get(name);
        handlers.push({ ListenerId, handler });
        this.handlers.set(name, handlers);
        // }
        return {
            name,
            handler,
            ListenerId,
            index: handlers.length
        };
    }
    removeListener(name, listeners, opts) {
        let opts_ = {};
        if (!opts)
            opts_["byId"] = false;
        else if (!opts.byId)
            opts_["byId"] = false;
        else if (typeof opts["byId"] !== "boolean")
            opts_["byId"] = false;
        else
            opts_ = opts;
        // const isGlobal = name.startsWith("global::")
        const Process = (_listener) => {
            let handlers = [];
            let arr2 = [];
            if (this.handlers.has(name))
                handlers = this.handlers.get(name);
            else
                return this._logger_.error("No valid event ID was provided.");
            for (const handle of handlers) {
                if (opts_["byId"] == true && handle.ListenerId !== _listener)
                    arr2.push(handle);
                if (opts_["byId"] !== true && handle.handler !== _listener)
                    arr2.push(handle);
            }
            this.handlers.set(name, arr2);
        };
        if (Array.isArray(listeners)) {
            for (const listen of listeners) {
                Process(listen);
            }
        }
        else
            Process(listeners);
    }
    removeAllListeners(name) {
        this.handlers.delete(name);
    }
    emit(name, ..._data) {
        return new Promise((resolve, reject) => {
            const obj = {
                emitId: mkRandStr2(16, HEX_CHAR_LIST),
                name,
                data: _data ? _data : undefined,
            };
            if (name.startsWith("children::") || name.startsWith("_children::")) {
                if (this.logLevel != LogLevels.Silent)
                    this._logger_.warn("Children are experimental!\n", "For now we are unable to retrieve the output of the children, so you will have to handle all of that on your own, good luck!");
                let states = new Map();
                let flatStates = [];
                const prefixless = name.startsWith("_children::") ? true : false;
                const id_ = name.replace("_children::", "children::").replace("children::", "");
                for (const child of this.children) {
                    // console.log(child)
                    console.log("isPrefixless =", prefixless);
                    child.emit(prefixless ? id_ : 'parent::' + id_, obj.data).then((state) => {
                        // console.log("Received smthn")
                        flatStates.push(state);
                        states.set(state.HandlerState.instance, {
                            meta: {
                                type: 'resolved'
                            },
                            state: state
                        });
                    }, (state) => {
                        // console.log("Received smthn")
                        flatStates.push(state);
                        states.set(state.HandlerState.instance, {
                            meta: {
                                type: 'rejected'
                            },
                            state: state
                        });
                    }).catch((state) => {
                        // console.log("Received smthn")
                        flatStates.push(state);
                        states.set(state.HandlerState.instance, {
                            meta: {
                                type: 'catch'
                            },
                            state: state
                        });
                    });
                }
                resolve({
                    accessibleChildrenExecutorStates: flatStates,
                    HandlerState: {
                        instance: this.instanceId,
                        status: HandlerStatus.Children
                    },
                    obj,
                    states
                });
            }
            if (name.startsWith("global::")) {
                if (this.logLevel != LogLevels.Silent)
                    this._logger_.warn("Globals are experimental!");
                let internalQueue = [];
                if (_glob_.alt_evQueue.queue.has(this.instanceId))
                    internalQueue = _glob_.alt_evQueue.queue.get(this.instanceId);
                internalQueue.push(obj);
                _glob_.alt_evQueue.queue.set(this.instanceId, internalQueue);
                setTimeout(() => {
                    const queueArr_ = _glob_.alt_evQueue.queue;
                    const queueArr = queueArr_.get(this.instanceId);
                    queueArr_.set(this.instanceId, queueArr.filter((elem) => elem != obj));
                    this.removeStore("execGlobs", obj);
                    // if (isOnce) {
                    //   _glob_["alt_evQueue"]["once"].delete(name);
                    // }
                    resolve({
                        accessibleChildrenExecutorStates: _glob_.globExecState.get(obj.emitId),
                        HandlerState: {
                            instance: this.instanceId,
                            status: HandlerStatus.Global,
                        },
                        obj,
                    });
                }, _glob_.alt_evQueue.constants.EMIT_REMOVE_TIMEOUT);
            }
            else {
                // this.queue.push(obj)
                const handler__ = this.Handle(obj.name, obj.data);
                if (this.parents && this.parents.length) {
                    for (const parent of this.parents) {
                        try {
                            parent.emit(`child::${obj.name}`, obj.data)
                                .then((value) => void value, (e) => {
                                if (this.logLevel == LogLevels.Verbose)
                                    this._logger_.error(e);
                                else
                                    void e;
                            }).catch(e => {
                                if (this.logLevel == LogLevels.Verbose)
                                    this._logger_.error(e);
                                else
                                    void e;
                            });
                            parent.emit(`${this.instanceId}.child::${obj.name}`, obj.data)
                                .then((value) => void value, (e) => {
                                if (this.logLevel == LogLevels.Verbose)
                                    this._logger_.error(e);
                                else
                                    void e;
                            }).catch(e => {
                                if (this.logLevel == LogLevels.Verbose)
                                    this._logger_.error(e);
                                else
                                    void e;
                            });
                        }
                        catch (e) {
                            this._logger_.error(e);
                            // if (this.logLevel == LogLevels.Verbose)
                            //   this._logger_.debug({
                            //     state: {
                            //       instance: this.instanceId,
                            //       status: HandlerStatus.Unknown,
                            //       err: e,
                            //     },
                            //   });
                        }
                    }
                }
                if (handler__.status == HandlerStatus.Ok)
                    resolve({
                        HandlerState: handler__,
                        obj,
                    });
                else
                    reject({
                        HandlerState: handler__,
                        obj,
                    });
            }
        });
    }
    Handle(name, data) {
        const RL_IsVerbose = this.respLevel == ResponseLevels.Verbose;
        let doesntExist = false;
        let _on_c = 0;
        let _once_c = 0;
        try {
            let handled = {
                on: {},
                once: {}
            };
            // if (name.startsWith("global::")) {
            //   if (_glob_["alt_evQueue"]["on"].has(name)) {
            //     const handlers = _glob_["alt_evQueue"]["on"].get(name);
            //     for (const handelen of handlers) {
            //       handelen.handler(data);
            //     }
            //   }
            //   if (_glob_["alt_evQueue"]["once"].has(name)) {
            //     const handlers = _glob_["alt_evQueue"]["once"].get(name);
            //     for (const handelen of handlers) {
            //       handelen.handler(data);
            //     }
            //   }
            // } else {
            if (!this.handlers.has(name) && !this.oneTimeHandlers.has(name))
                doesntExist = true;
            if (this.handlers.has(name)) {
                const handlers = this.handlers.get(name);
                for (const handelen of handlers) {
                    _on_c++;
                    if (Array.isArray(data))
                        handled.on["result_" + _on_c] = handelen.handler(...data);
                    else
                        handled.on["result_" + _on_c] = handelen.handler(data);
                }
            }
            if (this.oneTimeHandlers.has(name)) {
                const handlers = this.oneTimeHandlers.get(name);
                for (const handelen of handlers) {
                    _once_c++;
                    if (Array.isArray(data))
                        handled.once["result_" + _once_c] = handelen.handler(...data);
                    else
                        handled.once["result_" + _once_c] = handelen.handler(data);
                }
                this.oneTimeHandlers.delete(name);
            }
            if (doesntExist == true || (_on_c < 1 && _once_c < 1))
                return {
                    timestamp: RL_IsVerbose == true ? Date.now() : undefined,
                    instance: this.instanceId,
                    status: HandlerStatus.Unknown,
                    err: RL_IsVerbose == true
                        ? {
                            name: "NoHandlerState",
                            message: "No handler is found, therefore this call is ignored (this is not an actual error, just a state)",
                        }
                        : undefined,
                };
            // }
            if (this.logLevel == LogLevels.Verbose)
                this._logger_.debug({
                    name,
                    data,
                    state: {
                        status: HandlerStatus.Ok,
                    },
                });
            return {
                timestamp: RL_IsVerbose == true ? Date.now() : undefined,
                instance: this.instanceId,
                status: HandlerStatus.Ok,
                results: handled
            };
        }
        catch (e) {
            this._logger_.error(e);
            if (this.logLevel == LogLevels.Verbose)
                this._logger_.debug({
                    name,
                    data,
                    state: {
                        instance: this.instanceId,
                        status: HandlerStatus.Error,
                        err: e,
                    },
                });
            return {
                timestamp: RL_IsVerbose == true ? Date.now() : undefined,
                instance: this.instanceId,
                status: HandlerStatus.Error,
                err: e,
            };
        }
    }
}
SyncLoop();
