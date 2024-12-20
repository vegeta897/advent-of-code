import { diffXY, getNeighbors, inBounds, toGrid, toXY, XY } from '../util'

const parseInput = (input: string) => {
	let startXY: XY | undefined
	let endXY: XY | undefined
	const map = input
		.trim()
		.split('\n')
		.map((line, y) =>
			line.split('').map((v, x) => {
				if (v === 'S') {
					startXY = [x, y]
					return 0
				}
				if (v === 'E') {
					endXY = [x, y]
					return 0
				}
				return v === '#' ? 1 : 0
			})
		)
	if (!startXY) throw 'start not found!'
	if (!endXY) throw 'end not found!'
	return { map, startXY, endXY }
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
	const path: { xy: XY; time: number }[] = []
	let current = end
	while (current.grid !== start) {
		path.push({ xy: toXY(current.grid), time: end.steps - path.length })
		current = current.parent!
	}
	path.push({ xy: toXY(current.grid), time: end.steps - path.length })
	return path.reverse()
}

const getShortcutCount = (map: number[][], start: XY, end: XY, noclipTime: number) => {
	const path = findPath(map, start, end)
	let hundoSkips = 0
	for (let t = 0; t < path.length; t++) {
		const fromTile = path[t]
		for (let tt = t + 4; tt < path.length; tt++) {
			const toTile = path[tt]
			const diff = diffXY(fromTile.xy, toTile.xy)
			const distance = Math.abs(diff[0]) + Math.abs(diff[1])
			if (distance > noclipTime) continue
			const timeSaved = toTile.time - fromTile.time - distance
			if (timeSaved >= 100) {
				hundoSkips++
			}
		}
	}
	return hundoSkips
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { map, startXY, endXY } = parseInput(input)
	return getShortcutCount(map, startXY, endXY, 2)
}

export const part1Examples: Example[] = []

export const getPart2Answer: Answer = (input, example = false) => {
	const { map, startXY, endXY } = parseInput(input)
	return getShortcutCount(map, startXY, endXY, 20)
}

export const part2Examples: Example[] = []
