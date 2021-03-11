import * as PIXI from "pixi.js";

export const nodeOps = {
    createElement(type) {
        let element;
        switch (type) {
            case "Container":
                element = new PIXI.Container();
                break;
            case "Sprite": 
                element = new PIXI.Sprite();
                break;
            case "Text":
                element = new PIXI.Text("asd");
                break;
            default: break;
        }
        return element;
    },
    insert(el, parent) {
        parent.addChild(el);
    },
    parentNode(node) {
        return node.parentNode;
    },
    nextSibling(node) {
        return node.nextSibling;
    },
    remove(el) {
        const parent = el.parent;
        if(parent) {
            parent.removeChild(el);
        }
    },
    createComment() {},
    createText: (text) => new PIXI.Text(text),
    setText: (node, text) => {
       node.text = text;
    },
    setElementText(el, text) {
        el.text = text;
    }
}