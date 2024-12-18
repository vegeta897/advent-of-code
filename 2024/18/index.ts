import { getNeighbors, inBounds, toGrid, XY } from '../util'

const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(',').map((v) => +v) as XY)
}

type PathTile = {
	x: number
	y: number
	grid: string
	steps: number
	parent?: PathTile
}

const findPath = (map: number[][], [startX, startY]: XY, [endX, endY]: XY) => {
	const startGrid = toGrid(startX, startY)
	let current: PathTile = {
		x: startX,
		y: startY,
		grid: startGrid,
		steps: 0,
	}
	const openTiles: Map<string, PathTile> = new Map([[current.grid, current]])
	const closedTiles: Set<string> = new Set()
	while (openTiles.size > 0) {
		openTiles.delete(current.grid)
		closedTiles.add(current.grid)
		for (const [nx, ny] of getNeighbors(current.x, current.y)) {
			if (!inBounds([nx, ny], map)) continue
			if (map[ny][nx] !== 0) continue
			const nGrid = toGrid(nx, ny)
			if (closedTiles.has(nGrid)) continue
			const nTile: PathTile = {
				x: nx,
				y: ny,
				grid: nGrid,
				steps: current.steps + 1,
				parent: current,
			}
			if (nx === endX && ny === endY) {
				const path = constructPath(startGrid, nTile)
				return path
			}
			openTiles.set(nTile.grid, nTile)
		}
		current = getLowestScoreTile(openTiles)
	}
	return []
}

function getLowestScoreTile(list: Map<string, PathTile>) {
	let best
	for (const [, value] of list) {
		if (!best || value.steps < best.steps) {
			best = value
		}
	}
	return best!
}

function constructPath(start: string, end: PathTile) {
	const path: string[] = []
	let current = end
	while (current.grid !== start) {
		path.push(current.grid)
		current = current.parent!
	}
	path.push(current.grid)
	return path.reverse()
}

const buildMap = (size: number, initialBytes: XY[]) => {
	return new Array(size)
		.fill(0)
		.map((_, y) =>
			new Array(size)
				.fill(0)
				.map((_, x) => (initialBytes.find(([px, py]) => px === x && py === y) ? 1 : 0))
		)
}

export const getPart1Answer: Answer = (input, example = false) => {
	const mapSize = example ? 7 : 71
	const initialByteCount = example ? 12 : 1024
	const bytes = parseInput(input).slice(0, initialByteCount)
	const map = buildMap(mapSize, bytes)
	const path = findPath(map, [0, 0], [mapSize - 1, mapSize - 1])
	return path.length - 1 // Steps don't count the first grid
}

export const part1Examples: Example[] = [
	[
		`5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`,
		'22',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const mapSize = example ? 7 : 71
	const initialByteCount = example ? 12 : 1024
	const bytes = parseInput(input)
	const initialBytes = bytes.slice(0, initialByteCount)
	const map = buildMap(mapSize, initialBytes)
	let path: string[] = []
	for (let i = initialByteCount; i < bytes.length; i++) {
		const [byteX, byteY] = bytes[i]
		map[byteY][byteX] = 1
		const addedByteGrid = toGrid(byteX, byteY)
		if (path.length > 0 && !path.includes(addedByteGrid)) {
			continue
		}
		path = findPath(map, [0, 0], [mapSize - 1, mapSize - 1])
		if (path.length === 0) return `${byteX},${byteY}`
	}
	throw 'all paths valid?!'
}

export const part2Examples: Example[] = [[part1Examples[0][0], '6,1']]
