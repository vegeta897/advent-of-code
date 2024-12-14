export type XY = [x: number, y: number]
export const toGrid = (x: number, y: number) => `${x}:${y}`
export const toXY = (grid: string) => grid.split(':').map((v) => +v) as XY

export const DIRS: XY[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

export const NEIGHBOR_XY_4WAY: XY[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

export const NEIGHBOR_XY_8WAY: XY[] = [
	...NEIGHBOR_XY_4WAY,
	[1, -1],
	[1, 1],
	[-1, 1],
	[-1, -1],
]

export const getNeighbors = (x: number, y: number, ways: 4 | 8 = 4): XY[] =>
	(ways === 4 ? NEIGHBOR_XY_4WAY : NEIGHBOR_XY_8WAY).map(([nx, ny]) => [x + nx, y + ny])

export const scaleXY = (xy: XY, f: number) => xy.map((v) => v * f) as XY
export const addXY = (a: XY, b: XY): XY => [a[0] + b[0], a[1] + b[1]]
export const diffXY = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
export const multiplyXY = (a: XY, b: XY): XY => [a[0] * b[0], a[1] * b[1]]
export const divideXY = (a: XY, b: XY): XY => [a[0] / b[0], a[1] / b[1]]
export const moduloXY = (a: XY, b: XY): XY => [a[0] % b[0], a[1] % b[1]]

export const rotateXYCW = (x: number, y: number, turns: number): XY => {
	turns %= 4
	if (turns === 0) return [x, y]
	if (turns === 2) return [-x, -y]
	if (turns === 1) return [-y, x]
	return [y, -x]
}

export const inBounds = (position: XY, map: any[][]) =>
	position[0] >= 0 &&
	position[1] >= 0 &&
	position[0] < map[0].length &&
	position[1] < map.length

// Rotate map 90 degrees clockwise (works with non-square maps)
export const rotateMap = <T extends any>(map: T[][]) =>
	map[0].map((_, x) => map.map((_, y) => map[map.length - 1 - y][x]))

export const printMap = (map: any[][]) => {
	for (const row of map) {
		console.log(row.join(''))
	}
}
