import { defineComponent, h, onMounted, onUnmounted, reactive, ref, inject } from "@vue/runtime-core";
import TWEEN from "@tweenjs/tween.js";
import Map from "../component/map";
import Status from "../component/status";
import Plane, { SelfPlaneInfo } from "../component/plane";
import EnemyPlane, { EnemyPlaneInfo } from "../component/enemyPlane";
import Bullet, { SelfBulletInfo, EnemyBulletInfo } from "../component/bullet";
import Boom, { BoomInfo, BoomType } from "../component/boom";
import { stage, game } from "../config";
import { useKeyBoardAndMove, useFight } from "../use";
import { hitTest, createHashCode } from "../util";
// 我方飞机
const useSelfPlane = ({x, y}) => {
    const ticker = inject("ticker");
    const selfPlane = reactive({
        x: x,
        y: y,
        width: SelfPlaneInfo.width,
        height: SelfPlaneInfo.height,
        speed: SelfPlaneInfo.speed,
        life: SelfPlaneInfo.life
    });

    // 处理键盘移动事件
    const { x: planeX, y: planeY } = useKeyBoardAndMove({
        x,
        y,
        speed: selfPlane.speed
    });

    // 缓动出场
    const tween = new TWEEN.Tween({
        x,
        y
    }).to({
        x,
        y: y - SelfPlaneInfo.height - 20
    }).start();
    
    tween.onUpdate((obj) => {
        selfPlane.x = obj.x;
        selfPlane.y = obj.y;
    });

    const tweenTicker = () => {
        TWEEN.update();
    }

    onMounted(() => {
        ticker.add(tweenTicker);
    });

    onUnmounted(() => {
        ticker.remove(tweenTicker);
    })

    selfPlane.x = planeX;
    selfPlane.y = planeY;

    return {
        selfPlane
    }
}
// 我方子弹
const useSelfBullets = () => {
    const selfBullets = reactive([]);
    
    const createSelfBullet = (x, y) => {
        const id = createHashCode();
        const width = SelfBulletInfo.width;
        const height = SelfBulletInfo.height;
        const dir = SelfBulletInfo.dir;
        const speed = SelfBulletInfo.speed;
        selfBullets.push({
            x, y, id, width, height, dir, speed
        });
    }

    const destorySelfBullet = (bullet) => {
        const index = selfBullets.findIndex((info)=> info.id === bullet.id);

        if(index !== -1) {
            selfBullets.splice(index, 1);
        }
    }

    return {
        selfBullets,
        createSelfBullet,
        destorySelfBullet
    }
}
// 敌方飞机
const useEnemyPlanes = ({MaxEnemy}) => {
    const ticker = inject("ticker");
    const enemyPlanes = reactive([]);

    const createEnemyPlane = (x, y) => {
        const id = createHashCode();
        const width = EnemyPlaneInfo.width;
        const height = EnemyPlaneInfo.height;
        const speed = EnemyPlaneInfo.speed;
        const life = EnemyPlaneInfo.life;
        const score = EnemyPlaneInfo.score;
        enemyPlanes.push({
            x, y, id, width, height, speed, life, score
        });
    }

    const destroyEnemyPlane = (plane) => {
        const index = enemyPlanes.findIndex((info)=> info.id === plane.id);

        if(index !== -1) {
            enemyPlanes.splice(index, 1);
        }
    }

    const enemyPlaneTicker = () => {
        // 新增敌机
        if(enemyPlanes.length < MaxEnemy){
            const x = Math.random() * (stage.width - EnemyPlaneInfo.width);
            const y = 0;
            
            let rightPlace = true;
            for (const plane of enemyPlanes) {
                if(hitTest({
                    x, y, width: EnemyPlaneInfo.width, height: EnemyPlaneInfo.height
                }, plane)) {
                    rightPlace = false;
                }
            }
            if(rightPlace) {
                createEnemyPlane(x, y);
            }
        }
    }

    onMounted(() => {
        ticker.add(enemyPlaneTicker);
    })

    onUnmounted(() => {
        ticker.remove(enemyPlaneTicker);
    })

    return {
        enemyPlanes,
        createEnemyPlane,
        destroyEnemyPlane
    }
}
// 敌方子弹
const useEnemyBullets = () => {
    const enemyBullets = reactive([]);

    const createEnemyBullet = ({x, y}) => {
        const id = createHashCode();
        const width = EnemyBulletInfo.width;
        const height = EnemyBulletInfo.height;
        const dir = EnemyBulletInfo.dir;
        const speed = EnemyBulletInfo.speed;
        enemyBullets.push({
            x, y, id, width, height, dir, speed
        });
    }

    const destoryEnemyBullet = (bullet) => {
        const index = enemyBullets.findIndex((info)=> info.id === bullet.id);

        if(index !== -1) {
            enemyBullets.splice(index, 1);
        }
    }

    return {
        enemyBullets,
        createEnemyBullet,
        destoryEnemyBullet
    }
}
// 爆炸效果
const useBooms = () => {
    const ticker = inject("ticker");

    const booms = reactive([]);

    const createBoom = ({x, y, type}) => {
        const id = createHashCode();
        const stay = BoomInfo[type].stay;
        booms.push({ id, x, y, stay, type });
    }

    const destoryBoom = (boom) => {
        const index = booms.findIndex((info)=> info.id === boom.id);

        if(index !== -1) {
            booms.splice(index, 1);
        }
    }    

    const boomTicker = () => {
        booms.forEach((boom) => {
            boom.stay --;
            if(boom.stay <= 0) {
                destoryBoom(boom);
            }
        });
    };

    onMounted(() => {
        ticker.add(boomTicker);
    });

    onUnmounted(() => {
        ticker.remove(boomTicker);
    });

    return {
        booms,
        createBoom,
        destoryBoom
    }
}

export default defineComponent({
    setup(props, { emit }) {
        let score = ref(0);
        
        const { selfPlane } = useSelfPlane({
            x: (stage.width - SelfPlaneInfo.width) / 2,
            y: stage.height,
        });

        const { 
            selfBullets, 
            createSelfBullet, 
            destorySelfBullet 
        } = useSelfBullets();

        const { 
            enemyPlanes, 
            destroyEnemyPlane 
        } = useEnemyPlanes({MaxEnemy: game.maxEnemy});

        const { 
            enemyBullets, 
            createEnemyBullet, 
            destoryEnemyBullet 
        } = useEnemyBullets();

        const {
            booms,
            createBoom,
        } = useBooms();

        useFight({
            selfPlane,
            enemyPlanes,
            selfBullets,
            enemyBullets,
            booms,
            onBulletHit(selfBullet, enemyBullet) {
                destorySelfBullet(selfBullet);
                destoryEnemyBullet(enemyBullet);
                
                const x = selfBullet.x > enemyBullet.x 
                    ? selfBullet.x : enemyBullet.x - (BoomInfo.Bullet.width / 2);
                const y = enemyBullet.y - BoomInfo.Bullet.height / 2;
                createBoom({x, y, type: BoomType.Bullet});
            },
            onHitEnemy(selfBullet, enemyPlane) {
                destorySelfBullet(selfBullet);
                createBoom({x: selfBullet.x, y: selfBullet.y, type: BoomType.Bullet});

                enemyPlane.life--;

                if(enemyPlane.life <= 0) {
                    score.value += enemyPlane.score;
                    destroyEnemyPlane(enemyPlane);
                    createBoom({x: enemyPlane.x, y: enemyPlane.y, type: BoomType.EnemyPlane});
                }
            },
            onBeenHit(selfPlane, enemyBullet, onGameOver) {
                destoryEnemyBullet(enemyBullet);
                createBoom({x: enemyBullet.x, y: enemyBullet.y, type: BoomType.Bullet });

                selfPlane.life--;
                if(selfPlane.life <= 0) {
                    createBoom({x: selfPlane.x, y: selfPlane.y, type: BoomType.SelfPlane});
                    onGameOver && onGameOver(500);
                }
            },
            onPlaneHit(selfPlane, enemyPlane, onGameOver) {
                destroyEnemyPlane(enemyPlane);
                createBoom({x: enemyPlane.x, y: enemyPlane.y, type: BoomType.EnemyPlane});
                createBoom({x: selfPlane.x, y: selfPlane.y, type: BoomType.SelfPlane});

                selfPlane.life = 0;
                onGameOver && onGameOver(500);
            },
            onGameOver(delay) {
                setTimeout(() => {
                    emit("nextPage", "overPage");
                }, delay)
            }
        });

        const onAttack = ({x, y}) => {
            createSelfBullet(x, y);
        };

        const onEnemyAttack = ({x, y}) => {
            createEnemyBullet({x, y}); 
        };

        return {
            selfPlane,
            enemyPlanes,
            selfBullets,
            enemyBullets,
            booms,
            score,
            onAttack,
            onEnemyAttack
        }
    },

    render(ctx) {
        const createBullets = () => {
            return ctx.selfBullets.map((bullet) => {
                return h(Bullet, {x: bullet.x, y: bullet.y, dir: bullet.dir});
            })
        }

        const createEnemyPlanes = () => {
            return ctx.enemyPlanes.map((enemyPlane) => {
                return h(EnemyPlane, {
                    x: enemyPlane.x, 
                    y: enemyPlane.y,
                    onAttack: ctx.onEnemyAttack
                })
            })
        };

        const createEnemyBullets = () => {
            return ctx.enemyBullets.map((bullet) => {
                return h(Bullet, {x: bullet.x, y: bullet.y, dir: bullet.dir});
            });
        }

        const createBooms = () => {
            return ctx.booms.map(boom => {
                return h(Boom, {x: boom.x, y: boom.y, type: boom.type});
            });
        }

        return h("Container", {sortableChildren: true}, [
            h(Map),
            ctx.selfPlane.life > 0 ? h(Plane, {
                x: ctx.selfPlane.x, 
                y: ctx.selfPlane.y, 
                onAttack: ctx.onAttack
            }) : [],
            ...createBooms(),
            ...createBullets(),
            ...createEnemyPlanes(),
            ...createEnemyBullets(),
            h(Status, {life: ctx.selfPlane.life, score: ctx.score})
        ]);
    }
});