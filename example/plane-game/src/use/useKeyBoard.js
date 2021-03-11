import { inject, onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { borderTest } from "../util";
import { stage, game } from "../config";
import { SelfPlaneInfo } from "../component/plane";

const commandType = {
    Row: "Row",
    Col: "Col"
}

const CommandMap = {
    ArrowUp: {
        id: 1,
        dir: -1,
        type: commandType.Row
    },
    ArrowDown: {
        id: 2,
        dir: 1,
        type: commandType.Row
    },
    ArrowLeft: {
        id: 3,
        dir: -1,
        type: commandType.Col
    },
    ArrowRight: {
        id: 4,
        dir: 1,
        type: commandType.Col
    }
};

export const useKeyBoardAndMove = ({x, y, speed}) => {
    const ticker = inject("ticker");

    const moveX = ref(x);
    const moveY = ref(y);

    let commandList = [];

    const handleKeyDown = (e) => {
        const command = CommandMap[e.code];
    
        if(command && !existCommand(command)) {
            commandList.unshift(command);
        }
    }
    
    const handleKeyUp = (e) => {
        const command = CommandMap[e.code];
        if (command) {
          removeCommand(command);
        }
    }

    const removeCommand = (command) => {
        commandList = commandList.filter(({id}) => id !== command.id);
    } 

    const existCommand = (command) => {
        return commandList.some(({id}) => id == command.id);
    }

    const findRowCommand = () => {
        return commandList.find((command) => command.type === commandType.Row);
    }

    const findColCommand = () => {
        return commandList.find((command) => command.type === commandType.Col);
    }

    const moveTicker = () => {
        const rowCommand = findRowCommand();
        if(rowCommand) {
            moveY.value += rowCommand.dir * speed;
        }

        const colCommand = findColCommand();
        if(colCommand) {
            moveX.value += colCommand.dir * speed;
        }

        const { result, position } = borderTest({
            x: moveX.value,
            y: moveY.value,
            width: SelfPlaneInfo.width,
            height: SelfPlaneInfo.height
        }, stage);

        if(!result) {
            moveX.value = position.x;
            moveY.value = position.y;
        }
    }

    onMounted(() => {
        ticker.add(moveTicker);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    })

    onUnmounted(() => {
        ticker.remove(moveTicker);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    })

    return {
        x: moveX,
        y: moveY
    }
}

export const useKeyBoardAndAttack = (callback, interval) => {

    const ticker = inject("ticker");

    interval = interval || game.attackInterval;

    let isAttack = false;
    let time = 0;

    const handleKeyDown = (e) => {
        if(e.code === "Space") {
            isAttack = true;
        }
    };

    const handleKeyUp = (e) => {
        if(e.code === "Space") {
            isAttack = false;
        }
    }

    const attackTicker = () => {
        if(isAttack) {
            time++;
            if(time > interval) {
                callback && callback()
                time = 0;
            }
        }
    }

    onMounted(() => {
        ticker.add(attackTicker);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    });

    onUnmounted(() => {
        ticker.remove(attackTicker);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    })
}