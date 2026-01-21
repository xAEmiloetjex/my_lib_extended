import { Logger } from "../logger";
import { RestrictiveAny } from "../types";
import * as ENV from "../ENV";
const colorHandler_ = {
    blue: (inp) => `${inp}`,
    yellow: (inp) => `${inp}`,
    red: (inp) => `${inp}`,
    green: (inp) => `${inp}`,
    magenta: (inp) => `${inp}`
};
const logger = ENV.DEBUG_OPTS.FILE_MODE === true
    ? new Logger(ENV.DEBUG_OPTS.DEBUGGER_NAME, console, colorHandler_)
    : new Logger(ENV.DEBUG_OPTS.DEBUGGER_NAME);
export function debug(...args) {
    if (ENV.DEBUG === true) {
        logger.debug(...args);
    }
    return;
}
