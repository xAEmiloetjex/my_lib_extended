import { HandlerItem, LogLevels, ResponseLevels, } from "./core/EventQueue_2";
import { EventEmitter2 } from "./Events";
import { Logger } from "./logger";
import { HEX_CHAR_LIST } from "./core/types/constants_1";
import { mkRandStr2 } from "./core/utils/common";
export class LogHandler extends EventEmitter2 {
    instanceId = mkRandStr2(8, HEX_CHAR_LIST);
    __logger__ = new Logger(`LogHandler(${this.instanceId})`);
    _listeners = {};
    listeners = {};
    /**
     * Resets the overides applied to the listeners
     */
    resetListenersOveride() {
        return this.listeners = { ...this._listeners };
    }
    /**
     * Appends a different logger than the default
     */
    appendNewLogger(loggerClass) {
        return (this.__logger__ = loggerClass);
    }
    constructor(extraFuncs) {
        if (extraFuncs == undefined)
            extraFuncs = {};
        super();
        super.setLogLevel(LogLevels.Silent);
        super.setResponseLevel(ResponseLevels.Normal);
        this._listeners["error"] =
            super.on("__emitError", (err) => {
                this.__logger__.error(err);
                if (extraFuncs.error)
                    extraFuncs.error(err);
            });
        this._listeners["warn"] =
            super.on("__emitWarn", (err) => {
                this.__logger__.warn(err);
                if (extraFuncs.warn)
                    extraFuncs.warn(err);
            });
        this._listeners["info"] =
            super.on("__emitInfo", (err) => {
                this.__logger__.info(err);
                if (extraFuncs.info)
                    extraFuncs.info(err);
            });
        this._listeners["debug"] =
            super.on("__emitDebug", (err) => {
                this.__logger__.debug(err);
                if (extraFuncs.debug)
                    extraFuncs.debug(err);
            });
        this.listeners = { ...this._listeners };
    }
    /** * Helper method */
    __error(input) { return super.emit("__emitError", input); }
    /** * Helper method */
    __warn(input) { return super.emit("__emitWarn", input); }
    /** * Helper method */
    __info(input) { return super.emit("__emitInfo", input); }
    /** * Helper method */
    __debug(input) { return super.emit("__emitDebug", input); }
}
