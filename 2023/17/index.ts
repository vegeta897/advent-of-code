const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map((line) => line.split('').map((v) => +v))

type PathGrid = {
	x: number
	y: number
	hash: string
	lastDir: DIR
	straightMoves: number
	h: number
}

function findPath(
	map: number[][],
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	minStraightMoves = 0,
	maxStraightMoves = 3
) {
	let current: PathGrid = {
		x: startX,
		y: startY,
		hash: `${startX}:${startY}:${DIR.right}:${0}`,
		lastDir: DIR.right,
		straightMoves: 0,
		h: 0,
	}
	const mapSize = map.length
	const startDownHash = `${startX}:${startY}:${DIR.down}:${0}`
	const openGrids: Map<string, PathGrid> = new Map([
		[current.hash, current],
		[startDownHash, { ...current, hash: startDownHash, lastDir: DIR.down }],
	])
	const closedHashes: Set<string> = new Set()
	let best = Infinity
	while (openGrids.size > 0) {
		closedHashes.add(current.hash)
		openGrids.delete(current.hash)
		for (let n = 0; n < 4; n++) {
			if (current.straightMoves === maxStraightMoves && n === current.lastDir) continue
			if (current.straightMoves < minStraightMoves && n !== current.lastDir) continue
			if (n === flipDir(current.lastDir)) continue
			const [nx, ny] = neighborXYs[n]
			const toX = current.x + nx
			const toY = current.y + ny
			if (toX < 0 || toY < 0 || toX === mapSize || toY === mapSize) continue
			const straightMoves = 1 + (n === current.lastDir ? current.straightMoves : 0)
			const hash = `${toX}:${toY}:${n}:${straightMoves}`
			if (closedHashes.has(hash)) continue
			const heat = current.h + map[toX][toY]
			if (toX === endX && toY === endY) {
				if (heat < best) best = heat
				break
			}
			const neighbor: PathGrid = {
				x: toX,
				y: toY,
				lastDir: n,
				straightMoves,
				hash,
				h: heat,
			}
			const existing = openGrids.get(neighbor.hash)
			if (existing) {
				if (neighbor.h < existing.h) existing.h = neighbor.h
			} else {
				openGrids.set(neighbor.hash, neighbor)
			}
		}
		current = getLowestHGrid(openGrids)!
	}
	return best
}

function getLowestHGrid(list: Map<string, PathGrid>) {
	let best
	for (const [, value] of list) {
		if (!best || value.h < best.h) {
			best = value
		}
	}
	return best
}

enum DIR {
	right = 0,
	down = 1,
	up = 2,
	left = 3,
}

const neighborXYs = [
	[1, 0],
	[0, 1],
	[0, -1],
	[-1, 0],
]

const flipDir = (dir: DIR) =>
	dir === DIR.up
		? DIR.down
		: dir === DIR.left
		  ? DIR.right
		  : dir === DIR.down
		    ? DIR.up
		    : DIR.left

export const getPart1Answer: Answer = (input: string): string | number => {
	const map = parseInput(input)
	return findPath(map, 0, 0, map.length - 1, map.length - 1)
}

export const part1Examples: Example[] = [
	[
		`2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
		'102',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const map = parseInput(input)
	return findPath(map, 0, 0, map.length - 1, map.length - 1, 4, 10)
}

export const part2Examples: Example[] = [[part1Examples[0][0], '94']]
