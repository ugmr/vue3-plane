import { computed, defineComponent, h, ref } from "@vue/runtime-core";

import startPage from "./page/startPage";
import gamePage from "./page/gamePage";
import overPage from "./page/overPage";

const pageMap = {
    startPage,
    gamePage,
    overPage
}

export default defineComponent({
    setup() {
        const currentPageName = ref("startPage");

        const currentPage = computed(() => {
            return pageMap[currentPageName.value]
        })  

        const onNextPage = (pageName) => {
            currentPageName.value = pageName;
        }

        return {
            currentPage,
            onNextPage
        }
    },

    render(ctx) {
        return h("Container", [
            h(ctx.currentPage, {
                onNextPage: ctx.onNextPage
            })
        ]);
    }
})