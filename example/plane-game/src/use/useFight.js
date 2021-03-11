import { moveBullets, moveEnemyPlanes } from "./index";
import { inject , onMounted, onUnmounted } from "@vue/runtime-core";
import { hitTest } from "../util";

export const useFight = ({
    selfPlane,
    enemyPlanes,
    selfBullets,
    enemyBullets,
    onBulletHit,
    onHitEnemy,
    onBeenHit,
    onPlaneHit,
    onGameOver
}) => {
    const ticker = inject("ticker");

    const fightTicker = () => {
        // 移动        
        moveBullets(enemyBullets);
        moveBullets(selfBullets);
        moveEnemyPlanes(enemyPlanes);

        // 遍历我方子弹 
        selfBullets.forEach((selfBullet) => {
            // 子弹碰撞
            enemyBullets.forEach((enemyBullet) => {
                if(hitTest(selfBullet, enemyBullet)) {
                    onBulletHit && onBulletHit(selfBullet, enemyBullet);
                }
            })
            // 击中敌机
            enemyPlanes.forEach((enemyPlane) => {
                if(hitTest(selfBullet, enemyPlane)) {
                    onHitEnemy && onHitEnemy(selfBullet, enemyPlane);
                }
            });
        });
        // 飞机碰撞
        enemyPlanes.forEach(enemyPlane => {
            if(hitTest(selfPlane, enemyPlane)) {
                onPlaneHit && onPlaneHit(selfPlane, enemyPlane, onGameOver);
            }
        });

        // 被敌方击中
        enemyBullets.forEach((enemyBullet) => {
            if(hitTest(enemyBullet, selfPlane)) {
                onBeenHit && onBeenHit(
                    selfPlane,
                    enemyBullet,
                    onGameOver
                );
            }
        });
    }

    onMounted(() => {
        ticker.add(fightTicker);
    }); 

    onUnmounted(() => {
        ticker.remove(fightTicker);
    });
}