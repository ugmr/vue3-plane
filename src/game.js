import { Application } from "pixi.js";

export function getRootContainer(options) {

    const game = new Application(options);

    document.body.appendChild(game.view);

    return game;
}
