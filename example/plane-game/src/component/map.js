import { defineComponent, h, ref, inject, onMounted, onUnmounted} from "@vue/runtime-core";
import mapImage from "../assets/map.jpg";
import { stage, game } from "../config/index";

export default defineComponent({
    setup() {
        const ticker = inject("ticker");
        const mapHeight = stage.height;

        let mapY1 = ref(-mapHeight);
        let mapY2 = ref(0);

        const speed = game.mapSpeed;

        const mapTicker = () => {
            mapY1.value += speed;
            mapY2.value += speed;
            if (mapY1.value >= mapHeight ) {
                mapY1.value = -mapHeight;
            }
            if (mapY2.value >= mapHeight) {
                mapY2.value = -mapHeight;
            }
        };

        onMounted(() => {
            ticker.add(mapTicker);
        });

        onUnmounted(() => {
            ticker.remove(mapTicker);
        })

        return {
            mapY1,
            mapY2
        }
    },

    render(ctx) {
        return h("Container", [
            h("Sprite", { image: mapImage, y: ctx.mapY1 }),
            h("Sprite", { image: mapImage, y: ctx.mapY2 })
        ]);
    }
})