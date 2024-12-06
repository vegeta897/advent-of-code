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

export const rotateXYCW = (x: number, y: number, turns: number): XY => {
	turns %= 4
	if (turns === 0) return [x, y]
	if (turns === 2) return [-x, -y]
	if (turns === 1) return [-y, x]
	return [y, -x]
}
