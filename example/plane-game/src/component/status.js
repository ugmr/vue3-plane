import { defineComponent, h, ref, watch, onMounted} from "@vue/runtime-core";
import { utils, Rectangle, Loader, Sprite } from "pixi.js";
import life0 from "../assets/life0.png";
import life1 from "../assets/life1.png";
import life2 from "../assets/life2.png";
import life3 from "../assets/life3.png";
import scoreTitleImage from "../assets/score.png";

const lifeImageMap = [life0, life1, life2, life3];

const NumberInfo = {
    width: 30,
    height: 35
}

const getNumberTextures = () => {
    const loader = Loader.shared;

    const textures = [];
    loader.add("number", "/assets/number.json").load((loader, resources) => {
        const originTextures = resources["number"].textures;
        for(let i = 0; i < Object.keys(originTextures).length; i++) {
            const texture = originTextures[`number-${i}.png`];
            textures.push(texture);
        }
    });

    return textures;
}

const NumberTextures = getNumberTextures();

export default defineComponent({
    props: ["life", "score"],

    setup(props) {
        
        const life = ref(props.life);
        const score = ref(props.score);

        watch(props,(newProps) => {
            life.value = newProps.life;
            score.value = newProps.score;
        })

        return {
            life,
            score 
        }
    },

    render(ctx) {

        const createScore = () => {
            
            return ctx.score.toString().split("").map((number, index) => {
                const texture = NumberTextures[number];
                const x = index * NumberInfo.width;
                return h("Sprite", { texture, x });
            });
        }

        return h("Container", {zIndex: 1000},  [
            h("Container", {x: 20, y: 30, zIndex: 1000}, [
                h("Sprite", {image: scoreTitleImage}),
                h("Container", {x: 60, y: -5}, [
                    ...createScore()
                ]),
                h("Container", {x: 260}, [
                    h("Text",{style: {fill: "orange"}}, "血量"), 
                    h("Sprite", {image: lifeImageMap[ctx.life], x: 70})
                ])
            ]),
            
        ]);
    }
})