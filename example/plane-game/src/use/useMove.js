import { stage } from "../config";

const topLine = -50;
const bottomLine = stage.height + 50;

const overBorder = (val) => {
    return val < topLine || val > bottomLine;
}

export const moveBullets = (bullets) => {
    bullets.forEach((bullet, index) => {
        bullet.y += bullet.speed * bullet.dir;
        if(overBorder(bullet.y)) {
            bullets.splice(index, 1);
        }
    })
}

export const moveEnemyPlanes = (enemyPlanes) => {
    enemyPlanes.forEach((enemyPlane, index) => {
        enemyPlane.y += enemyPlane.speed;

        if(overBorder(enemyPlane.y)) {
            enemyPlanes.splice(index, 1);
        }
    });
}