import { defineComponent, h, ref, watch } from "@vue/runtime-core";
import planeImage from "../assets/plane.png";
import { useKeyBoardAndAttack } from "../use";
import { SelfBulletInfo } from "./bullet";
import { game } from "../config";

export const SelfPlaneInfo = {
    width: 120,
    height: 80,
    speed: 7,
    life: 3
}

export default defineComponent({
    props: ["x", "y"],

    setup(props, { emit }) {
        
        const x = ref(props.x);
        const y = ref(props.y);
        
        watch(props, (newProps) => {
            x.value = newProps.x;
            y.value = newProps.y;
        });

        useKeyBoardAndAttack(() => {
            emit("attack", {
                x: x.value + (SelfPlaneInfo.width  - SelfBulletInfo.width) / 2, 
                y: y.value - SelfBulletInfo.height
            });
        }, game.attackInterval);

        return {
            x,
            y
        }
    },

    render(ctx) {
        return h("Container", [
          h("Sprite", {image: planeImage, x: ctx.x, y: ctx.y})
        ]);
    }
})