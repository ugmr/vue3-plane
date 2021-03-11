import {defineComponent, h} from "@vue/runtime-core";
import mapImage from "../assets/map.jpg"
import overTitleImage from "../assets/over.gif";
import restartBtnImage from "../assets/restart.png";

export default defineComponent({
    setup(props, {emit}) {
        const restartGame = () => {
            emit("NextPage", "startPage");
        }

        return {
            restartGame
        }
    },

    render(ctx) {
        return h("Container", [
            h("Sprite", {image: mapImage}),
            h("Sprite", {
                image: overTitleImage,
                x: 129,
                y: 120
            }),
            h("Sprite", {
                image: restartBtnImage,   //214 * 63
                x: 188,
                y: 500,
                buttonMode: true,
                interactive: true,
                on: {
                    pointertap: ctx.restartGame
                }
            })
        ]);
    }
})