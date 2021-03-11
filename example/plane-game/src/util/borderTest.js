export const borderTest = (obj, stage) => {
    let position = {
        x: obj.x,
        y: obj.y
    };

    let result = true;

    if(obj.x < 0) {
        position.x = 0;
        result = false;
    }
    if(obj.y < 0) {
        position.y = 0;
        result = false;
    }
    if(obj.x + obj.width > stage.width) {
        position.x = stage.width - obj.width;
        result = false;
    }
    if(obj.y + obj.height > stage.height) {
        position.y = stage.height - obj.height;
        result = false;
    }

    return { result, position };
}