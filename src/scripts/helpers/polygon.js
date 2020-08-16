export function rotatePolygon(coords, alpha) {
    // const alpha = deg * Math.PI / 180; // radians
    const {width, height} = getPolygonSize(coords);
    const centerX = width / 2;
    const centerY = height / 2;

    const newCoords = coords.map(point => {
        const x = point[0];
        const y = point[1];
        const x2 = centerX + (x - centerX) * Math.cos(alpha) - (y - centerY) * Math.sin(alpha);
        const y2 = centerY + (x - centerX) * Math.sin(alpha) + (y - centerY) * Math.cos(alpha);
        return [x2, y2];
    });

    return newCoords;
}

export function getPolygonPos(coords, pos) {
    const {width, height} = getPolygonSize(coords);

    return {
        x: (pos.x + .5) - width / 2,
        y: (pos.y + .5) - height / 2
    }
    // why .5 ? circle rendering with pos + .5 in display
}

function getPolygonSize(coords) {
    let width = 0, height = 0;
    coords.forEach(coord => {
        if (coord[0] > width) width = coord[0];
        if (coord[1] > height) height = coord[1]
    });
    return {
        width,
        height
    }
}
