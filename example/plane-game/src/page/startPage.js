import { defineComponent, h } from "@vue/runtime-core";
import backgroundImage from "../assets/background.jpg"
import titleImage from "../assets/title.png";
import startBtnImage from "../assets/startBtn.png";

export default defineComponent({
    setup(props, {emit}) {
        const startGame = () => {
            emit("NextPage", "gamePage");
        }

        return {
            startGame
        }
    },

    render(ctx) {
        return h("Container", [
            h("Sprite", {image: backgroundImage}),
            h("Sprite", {image: titleImage, x: 21, y: 20}),
            h("Sprite", {
                image: startBtnImage,
                x: 137, 
                y: 500, 
                buttonMode: true,
                interactive: true,
                on: {
                    pointertap: ctx.startGame
                }
            })  
        ]);
    }
})