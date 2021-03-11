import { createRenderer } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps.js";
import { patchProp } from "./patchProp.js";

const render = createRenderer({
    ...nodeOps,
    patchProp ,
});

export function createApp(rootComponent) {
    return render.createApp(rootComponent);
}

export { getRootContainer } from "./game";