export function collisionDetection(element1, element2, extra) {
    extra = extra || {
        y1: 0,
        y2: 0
    }

    return element1.x < element2.x + element2.width &&
        element1.x + element1.width > element2.x &&
        element1.y < element2.y + element2.height + extra.y1 &&
        element1.y + element1.height > element2.y + extra.y2;
}