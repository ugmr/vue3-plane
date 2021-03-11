import { defineComponent, h, ref, watch } from "@vue/runtime-core";
import bulletBoomImage from "../assets/boom.png";
import enemyBoomImage from "../assets/enemy-boom.png";
import selfBoomImage from "../assets/plane-boom.png";

export const BoomInfo = {
    Bullet: {
        width: 30,
        height: 30,
        stay: 20
    },
    SelfPlane: {
        width: 120,
        height: 85,
        stay: 20
    },
    EnemyPlane: {
        width: 118,
        height: 89,
        stay: 20
    }
}

const BoomImageMap = {
    Bullet: bulletBoomImage,
    SelfPlane: selfBoomImage,
    EnemyPlane: enemyBoomImage
}

export const BoomType = {
    Bullet: "Bullet",
    SelfPlane: "SelfPlane",
    EnemyPlane: "EnemyPlane"
}

export default defineComponent({
    props: ["x", "y", "type"],

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
            type: props.type
        }
    },

    render(ctx) {
        return h("Container", [
            h("Sprite", {
                image: BoomImageMap[ctx.type],
                x: ctx.x, 
                y: ctx.y
            })
        ]);
    }
})