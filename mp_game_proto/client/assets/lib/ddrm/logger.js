import * as util from "node:util";
import {} from "./types";
const colorHandler_ = {
    blue: (inp) => `${Logger.ANSI_ESCAPE}[1;94m${inp}${Logger.ANSI_ESCAPE}[0m`,
    yellow: (inp) => `${Logger.ANSI_ESCAPE}[1;33m${inp}${Logger.ANSI_ESCAPE}[0m`,
    red: (inp) => `${Logger.ANSI_ESCAPE}[1;31m${inp}${Logger.ANSI_ESCAPE}[0m`,
    green: (inp) => `${Logger.ANSI_ESCAPE}[1;32m${inp}${Logger.ANSI_ESCAPE}[0m`,
    magenta: (inp) => `${Logger.ANSI_ESCAPE}[1;95m${inp}${Logger.ANSI_ESCAPE}[0m`,
};
export var ELoggerLevels;
(function (ELoggerLevels) {
    ELoggerLevels[ELoggerLevels["Info"] = 0] = "Info";
    ELoggerLevels[ELoggerLevels["Warn"] = 1] = "Warn";
    ELoggerLevels[ELoggerLevels["Error"] = 2] = "Error";
    ELoggerLevels[ELoggerLevels["Debug"] = 3] = "Debug";
    ELoggerLevels[ELoggerLevels["Http"] = 4] = "Http";
})(ELoggerLevels || (ELoggerLevels = {}));
export const levels = ELoggerLevels;
export class Logger {
    colorHandler;
    static ANSI_ESCAPE = "\x1b";
    output = console;
    log_(...args) {
        this.output.log(...args);
    }
    static timestamp() {
        const d = new Date();
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();
        return {
            hours,
            minutes,
            seconds,
            combined: `${hours}:${minutes}:${seconds}`,
        };
    }
    prefix = "";
    constructor(prefix = "", output = console, colorHandler = colorHandler_) {
        this.colorHandler = colorHandler;
        this.prefix = prefix;
        this.output = output;
    }
    log(level, ...args) {
        this.log_(`[${Logger.timestamp().combined}]:`, this.prefix !== "" ? `[${this.prefix}]` : "", `${this.levelColor(this.parseLevel(level))}`, util.format(...args));
    }
    info(...args) {
        this.log("info", ...args);
    }
    warn(...args) {
        this.log("warn", ...args);
    }
    error(...args) {
        this.log("error", ...args);
    }
    debug(...args) {
        this.log("debug", ...args);
    }
    http(...args) {
        this.log("http", ...args);
    }
    levelColor(level) {
        if (level === 0) {
            // Info
            return this.colorHandler.blue(`INFO:`);
        }
        if (level === 1) {
            // Warn
            return this.colorHandler.yellow(`WARN:`);
        }
        if (level === 2) {
            // Error
            return this.colorHandler.red(`ERROR:`);
        }
        if (level === 3) {
            // Debug
            return this.colorHandler.green(`DEBUG:`);
        }
        if (level === 4) {
            // Http
            return this.colorHandler.magenta(`HTTP:`);
        }
    }
    parseLevel(level) {
        let Converted;
        if (typeof level === "string") {
            if (level.toLowerCase() == "info" || level.toLowerCase() == "log")
                Converted = ELoggerLevels.Info;
            if (level.toLowerCase() == "warn" || level.toLowerCase() == "warning")
                Converted = ELoggerLevels.Warn;
            if (level.toLowerCase() == "err" || level.toLowerCase() == "error")
                Converted = ELoggerLevels.Error;
            if (level.toLowerCase() == "debug")
                Converted = ELoggerLevels.Debug;
            if (level.toLowerCase() == "http")
                Converted = ELoggerLevels.Http;
        }
        else
            Converted = level;
        return Converted;
    }
}
