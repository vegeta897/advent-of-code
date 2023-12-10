const parseInput = (input: string) => {
	const map: Record<string, Pipe> = {}
	let startGrid: string
	const rows = input.trim().split('\n')
	const maxX = rows[0].length - 1
	const maxY = rows.length - 1
	rows.forEach((row, y) => {
		row.split('').forEach((char, x) => {
			if ('|-LJ7F'.includes(char)) {
				map[toGrid(x, y)] = char as Pipe
			} else if (char === 'S') {
				startGrid = toGrid(x, y)
			}
		})
	})
	if (!startGrid!) throw 'no start grid'
	return { map, startGrid, maxX, maxY }
}

type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F'

enum DIR {
	up = 0,
	right = 1,
	down = 2,
	left = 3,
}

const neighborXYs = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

const connections = {
	'|': [DIR.up, DIR.down],
	'-': [DIR.left, DIR.right],
	'L': [DIR.up, DIR.right],
	'J': [DIR.up, DIR.left],
	'7': [DIR.down, DIR.left],
	'F': [DIR.down, DIR.right],
}

const toGrid = (x: number, y: number) => `${x}:${y}`
const toXY = (grid: string) => grid.split(':').map((v) => +v)
const flipDir = (dir: DIR) => (dir === 0 ? 2 : dir === 2 ? 0 : dir === 1 ? 3 : 1)

function getConnectingNeighbors(map: Record<string, Pipe>, grid: string, except?: DIR) {
	const [x, y] = toXY(grid)
	const neighbors: Record<string, DIR> = {}
	const fromPipeConnections = connections[map[grid]]
	for (let i = 0; i < neighborXYs.length; i++) {
		if (i === except) continue
		if (fromPipeConnections && !fromPipeConnections.includes(i)) continue
		const [dx, dy] = neighborXYs[i]
		const nGrid = toGrid(x + dx, y + dy)
		const pipe = map[nGrid]
		if (pipe) {
			if (connections[pipe].includes(flipDir(i))) {
				neighbors[nGrid] = i
			}
		}
	}
	return neighbors
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { map, startGrid } = parseInput(input)
	const startNeighbors = getConnectingNeighbors(map, startGrid)
	const startNeighborDirsSortedHash = JSON.stringify(Object.values(startNeighbors).sort())
	const matchingConnection = Object.entries(connections).find(([pipe, dirs]) => {
		const hash = JSON.stringify(dirs.sort())
		return hash === startNeighborDirsSortedHash
	})
	map[startGrid] = matchingConnection![0] as Pipe
	let steps = 1
	let currentGrid = Object.keys(startNeighbors)[0] // doesnt matter which dir we go
	let backwards = flipDir(Object.values(startNeighbors)[0])
	while (currentGrid !== startGrid) {
		const neighbors = Object.entries(getConnectingNeighbors(map, currentGrid, backwards))
		const [nextGrid, nextDir] = neighbors[0]
		currentGrid = nextGrid
		backwards = flipDir(nextDir)
		steps++
	}
	const furthestStep = steps / 2
	if (furthestStep !== Math.floor(furthestStep))
		throw `non-even furthest step ${furthestStep}`
	return furthestStep
}

export const part1Examples: Example[] = [
	[
		`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
		'8',
	],
]

const pipeSides = {
	'|': [[[DIR.left], [DIR.right]], , [[DIR.right], [DIR.left]]],
	'-': [, [[DIR.up], [DIR.down]], , [[DIR.down], [DIR.up]]],
	'L': [, , [, [DIR.left, DIR.down]], [[DIR.down, DIR.left]]],
	'J': [, [, [DIR.down, DIR.right]], [[DIR.down, DIR.right], []]],
	'7': [[, [DIR.up, DIR.right]], [[DIR.up, DIR.right]], ,],
	'F': [[[DIR.left, DIR.up]], , , [, [DIR.left, DIR.up]]],
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const { map, startGrid, maxX, maxY } = parseInput(input)
	const startNeighbors = getConnectingNeighbors(map, startGrid)
	const startNeighborDirsSortedHash = JSON.stringify(Object.values(startNeighbors).sort())
	const matchingConnection = Object.entries(connections).find(([pipe, dirs]) => {
		const hash = JSON.stringify(dirs.sort())
		return hash === startNeighborDirsSortedHash
	})
	map[startGrid] = matchingConnection![0] as Pipe
	const pathMap: typeof map = { [startGrid]: map[startGrid] }
	let currentGrid = Object.keys(startNeighbors)[0] // doesnt matter which dir we go
	let currentDir = Object.values(startNeighbors)[0]
	const path: { grid: string; dir: DIR }[] = [
		{ grid: startGrid, dir: 0 },
		{ grid: currentGrid, dir: currentDir },
	]
	pathMap[currentGrid] = map[currentGrid]
	let backwards = flipDir(currentDir)
	while (currentGrid !== startGrid) {
		const neighbors = Object.entries(getConnectingNeighbors(map, currentGrid, backwards))
		const [nextGrid, nextDir] = neighbors[0]
		currentDir = nextDir
		currentGrid = nextGrid
		pathMap[currentGrid] = map[currentGrid]
		path.push({ grid: currentGrid, dir: currentDir })
		backwards = flipDir(currentDir)
	}
	path[0].dir = currentDir
	path.pop() // remove last path node, which is the start
	// crawl each side of each path grid until OOB is reached - that side is not enclosed
	let enclosedSide: 0 | 1
	for (const { grid, dir } of path) {
		if (enclosedSide! >= 0) break
		const currentPipe = pathMap[grid]
		const sides = pipeSides[currentPipe][dir]
		if (!sides) continue
		const [x, y] = toXY(grid)
		for (let s = 0; s <= 1; s++) {
			if (enclosedSide! >= 0) break
			const dirsOnSide = sides[s]
			if (!dirsOnSide) continue
			for (const sideDir of dirsOnSide) {
				const sideX = x + neighborXYs[sideDir][0]
				const sideY = y + neighborXYs[sideDir][1]
				const sideGrid = toGrid(sideX, sideY)
				if (pathMap[sideGrid]) continue // dont crawl non-empty space
				const { leak } = crawl(pathMap, sideGrid, maxX, maxY)
				if (leak) {
					enclosedSide = s === 0 ? 1 : 0
					break
				}
			}
		}
	}
	if (!(enclosedSide! >= 0)) throw 'enclosed side not found'
	const insideGrids: Set<string> = new Set()
	for (const { grid, dir } of path) {
		const currentPipe = pathMap[grid]
		const sides = pipeSides[currentPipe][dir]
		if (!sides) continue
		const [x, y] = toXY(grid)
		const dirsOnSide = sides[enclosedSide!]
		if (!dirsOnSide) continue
		for (const sideDir of dirsOnSide) {
			const sideX = x + neighborXYs[sideDir][0]
			const sideY = y + neighborXYs[sideDir][1]
			const sideGrid = toGrid(sideX, sideY)
			if (pathMap[sideGrid]) continue // Don't crawl non-empty space
			if (insideGrids.has(sideGrid)) continue // Don't crawl already-crawled
			const { crawled, leak } = crawl(pathMap, sideGrid, maxX, maxY)
			if (leak) throw 'leak found on enclosed side!'
			crawled.forEach(insideGrids.add, insideGrids) // Add crawled grids to insideGrids
			// console.log(insideGrids.size)
		}
	}
	return insideGrids.size
}

function crawl(map: Record<string, Pipe>, grid: string, maxX: number, maxY: number) {
	const crawled: Set<string> = new Set()
	const toCrawl: Set<string> = new Set([grid])
	while (toCrawl.size > 0) {
		const [crawling] = toCrawl
		toCrawl.delete(crawling)
		crawled.add(crawling)
		const [x, y] = toXY(crawling)
		for (let i = 0; i < neighborXYs.length; i++) {
			const [dx, dy] = neighborXYs[i]
			const nx = x + dx
			const ny = y + dy
			if (nx < 0 || ny < 0 || nx > maxX || ny > maxY) {
				return { crawled, leak: true }
			}
			const nGrid = toGrid(nx, ny)
			if (crawled.has(nGrid)) continue // already crawled
			if (map[nGrid]) continue // non-empty
			toCrawl.add(nGrid)
		}
	}
	return { crawled, leak: false }
}

export const part2Examples: Example[] = [
	[
		`..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`,
		'4',
	],
]
