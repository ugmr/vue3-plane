import { defineComponent, h, ref, watch } from "@vue/runtime-core";
import bulletImage from "../assets/bullet.png";
import enemyBulletImage from "../assets/enemy-bullet.png";

export const SelfBulletInfo = {
    width: 26,
    height: 68,
    dir: -1,
    speed: 5
}

export const EnemyBulletInfo = {
    width: 15,
    height: 30,
    dir: 1,
    speed: 3
}

export default defineComponent({
    props: ["x", "y", "dir"],

    setup(props) {
        
        const x = ref(props.x);
        const y = ref(props.y);
        
        watch(props, (newProps) => {
            x.value = newProps.x;
            y.value = newProps.y;
        });

        return {
            x,
            y,
            dir: props.dir,
        }
    },

    render(ctx) {
        return h("Container", [
            h("Sprite", {
                image: ctx.dir === 1? enemyBulletImage : bulletImage, 
                x: ctx.x, 
                y: ctx.y
            })
        ]);
    }
})