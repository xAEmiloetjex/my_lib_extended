import * as ws from "ws";

import { KVStore } from "../../lib/KVStore/index.js";
import { FileDriver } from "../../lib/KVStore/drivers/FileDriver.js";
import { Vec, Spaces, VecTypes, type VecString } from "../../lib/vector/index.js";
import { Logger } from "../../lib/ddrm/logger.js";

import { WSS_CFG } from "../../config.js";
import type { int } from "../../lib/ddrm/index";
import { mkRandStr3, randomHSV, uniqueStore } from "../../lib/ddrm/core/utils/common.js";
import { CHAR_LIST } from "../../lib/ddrm/core/types/constants_1.js";

import * as common from '../common/index.js'
import type {Player} from '../common/index';

const {WebSocketServer, WebSocket} = ws;

const BOT_FPS = 60;

interface Bot {
    ws: WebSocket,
    me: Player | undefined,
    goalX: number,
    goalY: number,
    timeoutBeforeTurn: undefined | number,
}

function createBot(): Bot {
    const bot: Bot = {
        //@ts-ignore
        ws: new WebSocket(`ws://localhost:${common.SERVER_PORT}/`),
        me: undefined,
        goalX: common.WORLD_WIDTH*0.5,
        goalY: common.WORLD_HEIGHT*0.5,
        timeoutBeforeTurn: undefined,
    };

    bot.ws.binaryType = 'arraybuffer';

    bot.ws.addEventListener("message", (event) => {
        if (!(event.data instanceof ArrayBuffer)) {
            return;
        }
        const view = new DataView(event.data);
        if (bot.me === undefined) {
            if (common.HelloStruct.verify(view)) {
                bot.me = {
                    id: common.HelloStruct.id.read(view),
                    x: common.HelloStruct.x.read(view),
                    y: common.HelloStruct.y.read(view),
                    moving: 0,
                    hue: common.HelloStruct.hue.read(view)/256*360,
                }
                turn();
                setTimeout(tick, 1000/BOT_FPS);
                console.log(`Connected as player ${bot.me.id}`);
            } else {
                console.error("Received bogus-amogus message from server. Incorrect `Hello` message.", view)
                bot.ws.close();
            }
        } else {
            if (common.PlayersMovingHeaderStruct.verify(view)) {
                const count = common.PlayersMovingHeaderStruct.count(view);

                for (let i = 0; i < count; ++i) {
                    const playerView = new DataView(event.data, common.PlayersMovingHeaderStruct.size + i*common.PlayerStruct.size, common.PlayerStruct.size);

                    const id = common.PlayerStruct.id.read(playerView);
                    if (id === bot.me.id) {
                        bot.me.moving = common.PlayerStruct.moving.read(playerView);
                        bot.me.x = common.PlayerStruct.x.read(playerView);
                        bot.me.y = common.PlayerStruct.y.read(playerView);
                    }
                }
            }
        }
    })

    function turn() {
        if (bot.me !== undefined) {
            const view = new DataView(new ArrayBuffer(common.AmmaMovingStruct.size));
            common.AmmaMovingStruct.kind.write(view, common.MessageKind.AmmaMoving);

            // Full stop
            for (let direction = 0; direction < common.Direction.Count; ++direction) {
                if ((bot.me.moving>>direction)&1) {
                    common.AmmaMovingStruct.direction.write(view, direction);
                    common.AmmaMovingStruct.start.write(view, 0);
                    bot.ws.send(view);
                }
            }

            // New direction
            const direction = Math.round(Math.random()*common.Direction.Count);
            bot.timeoutBeforeTurn = Math.random()*common.WORLD_WIDTH*0.5/common.PLAYER_SPEED;

            // Sync
            common.AmmaMovingStruct.direction.write(view, direction);
            common.AmmaMovingStruct.start.write(view, 1);
            bot.ws.send(view);
        }
    }

    let previousTimestamp = 0;
    function tick() {
        const timestamp = performance.now();
        const deltaTime = (timestamp - previousTimestamp)/1000;
        previousTimestamp = timestamp;
        if (bot.timeoutBeforeTurn !== undefined) {
            bot.timeoutBeforeTurn -= deltaTime;
            if (bot.timeoutBeforeTurn <= 0) turn();
        }
        if (bot.me !== undefined) {
            common.updatePlayer(bot.me, deltaTime)
        }
        setTimeout(tick, Math.max(0, 1000/BOT_FPS - timestamp));
    }

    return bot
}

let bots: Array<Bot> = []
for (let i = 0; i < 200; ++i) bots.push(createBot())