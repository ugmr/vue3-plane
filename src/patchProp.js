import * as PIXI from "pixi.js";

export const patchProp = (el, key, prevValue, nextValue) => {
   if (key === "on" || key === "image" || key === "style") {
    switch (key) {
        case "on":
            Object.keys(nextValue).forEach((eventName) => {
                const callback = nextValue[eventName];
                el.on(eventName, callback);
            });
            break;
        case "image":
            let texture = PIXI.Texture.from(nextValue);
            el.texture = texture;
            break;
        case "style":
            let style = new PIXI.TextStyle(nextValue);
            el.style = style;
            console.log(style)
            break;
        default: break; 
    }
  } else {
    el[key] = nextValue;
  }
}