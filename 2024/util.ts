export type XY = [x: number, y: number]
export const toGrid = (x: number, y: number) => `${x}:${y}`
export const toXY = (grid: string) => grid.split(':').map((v) => +v) as XY

export const DIRS: XY[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

export enum Direction {
	up = 0,
	right = 1,
	down = 2,
	left = 3,
}

export const flipDir = (dir: Direction) =>
	dir === Direction.up
		? Direction.down
		: dir === Direction.left
			? Direction.right
			: dir === Direction.down
				? Direction.up
				: Direction.left

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

export const scaleXY = ([x, y]: XY, f: number): XY => [x * f, y * f]
export const addXY = (a: XY, b: XY): XY => [a[0] + b[0], a[1] + b[1]]
export const diffXY = (a: XY, b: XY): XY => [a[0] - b[0], a[1] - b[1]]
export const multiplyXY = (a: XY, b: XY): XY => [a[0] * b[0], a[1] * b[1]]
export const divideXY = (a: XY, b: XY): XY => [a[0] / b[0], a[1] / b[1]]
export const moduloXY = (a: XY, b: XY): XY => [a[0] % b[0], a[1] % b[1]]
export const flipXY = ([x, y]: XY): XY => [-x, -y]
export const equalXY = (a: XY, b: XY) => a[0] === b[0] && a[1] === b[1]

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

export const arraysEqual = (a: any[], b: any[]) => {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}
