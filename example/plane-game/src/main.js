import { createApp, getRootContainer } from "../../../src/index";
import App from "./App.js";
import { stage } from "./config/index";

const game = getRootContainer(stage);

const app = createApp(App);

app.provide("ticker", game.ticker);

app.mount(game.stage);