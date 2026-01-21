import { Logger } from "./lib/ddrm/logger";
import {spawn} from "node:child_process";

const logger = new Logger("SERVE")

function cmd(
    program: string,
    args: string[] = []
): ReturnType<typeof spawn> {
    const spawnOptions = { "shell": true };
    
    logger.info('CMD:', program, args.flat(), spawnOptions);
    const p = spawn(program, args.flat(), spawnOptions);

    p.stdout.on('data', (data) => process.stdout.write(data));
    p.stderr.on('data', (data) => process.stdout.write(data));
    p.on('close', (code) => {
        if (code !== 0) {
            console.error(program, args, 'exited with', code);
        }
    });
    return p;
}

// cmd('deno', ["--sloppy-imports", "--allow-all", "--watch", "main.ts"]);
// cmd('http-server', ['-p', '6969', /* '-a', '127.0.0.1', '-s', */ '-c-1', '-d', 'false'])