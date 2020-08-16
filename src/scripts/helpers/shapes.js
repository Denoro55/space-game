export function createPolygon(coords, size) {
    return coords.map(point => {
        return [
            point[0] * size,
            point[1] * size,
        ]
    })
}
