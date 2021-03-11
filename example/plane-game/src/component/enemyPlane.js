import { defineComponent, h, onMounted, onUnmounted, ref, watch } from "@vue/runtime-core";
import enemyPlane from "../assets/enemy-plane.png";
import { game } from "../config";
import { EnemyBulletInfo } from "./bullet";

export const EnemyPlaneInfo = {
    width: 132,
    height: 90,
    life: 3,
    speed: 1,
    score: 100
}
const DefaultAttackInterval = 100;

const useAttack = (callback, interval) => {
    interval = interval || DefaultAttackInterval;

    let intervalId;
    

    onMounted(() => {
        callback && (intervalId = setInterval(() => {
            callback();
        }, interval));
    });

    onUnmounted(() => {
        if(intervalId) clearInterval(intervalId);
    })

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

        useAttack(() => {
            emit("attack", {
                x: x.value + (EnemyPlaneInfo.width - EnemyBulletInfo.width) / 2,
                y: y.value + EnemyPlaneInfo.height
            });
        }, game.enemyAttackInterval);

        return {
            x,
            y
        }
    },

    render(ctx) {
        return h("Container", [
          h("Sprite", {image: enemyPlane, x: ctx.x, y: ctx.y})
        ]);
    }
});