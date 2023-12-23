const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map((line) => line.split(''))

const neighborXYs = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
]
const toGrid = (x: number, y: number) => `${x}:${y}`
const arrows = {
	'>': 0,
	'<': 2,
	'v': 1,
	'^': 3,
}
const opposites = [2, 3, 0, 1]

function findPath(
	map: string[][],
	memory: Map<string, string[]>,
	path: string[],
	x: number,
	y = 0
) {
	const cacheKey = `${toGrid(x, y)}`
	const cached = memory.get(cacheKey)
	if (cached !== undefined) return cached
	const options: [string, number, number][] = []
	while (true) {
		const arrow = arrows[map[y][x] as keyof typeof arrows]
		if (arrow !== undefined) {
			const [nx, ny] = neighborXYs[arrow]
			const toX = x + nx
			const toY = y + ny
			const nGrid = toGrid(toX, toY)
			options.push([nGrid, toX, toY])
		} else {
			for (let n = 0; n < 4; n++) {
				const [nx, ny] = neighborXYs[n]
				const toX = x + nx
				const toY = y + ny
				if (toX < 1 || toY < 1 || toX === map.length - 1 || toY === map.length) continue
				if (map[toY][toX] === '#') continue
				const arrow = arrows[map[toY][toX] as keyof typeof arrows]
				if (arrow !== undefined && arrow === opposites[n]) continue
				const nGrid = toGrid(toX, toY)
				if (path.includes(nGrid)) continue
				options.push([nGrid, toX, toY])
			}
		}
		if (options.length === 1) {
			const [grid, oX, oY] = options[0]
			options.length = 0
			x = oX
			y = oY
			path.push(grid)
		} else if (options.length === 0) {
			return path // dead end
		} else {
			break
		}
	}
	let longestPath: string[] = []
	for (const [oGrid, oX, oY] of options) {
		const optionPath = findPath(map, memory, [...path, oGrid], oX, oY)
		if (optionPath.length > longestPath.length) longestPath = optionPath
	}
	memory.set(cacheKey, longestPath)
	return longestPath
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const map = parseInput(input)
	const startX = map[0].indexOf('.')
	const path = findPath(map, new Map(), [], startX)
	return path.length
}

export const part1Examples: Example[] = [
	[
		`#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`,
		'94',
	],
]

function getNodeOptions(map: string[][], x: number, y: number) {
	const options = neighborXYs
		.map(([nx, ny], o) => [x + nx, y + ny, o])
		.filter(([toX, toY]) => map[toY][toX] !== '#') as [number, number, number][]
	if (options.length < 3) return false
	return options
}

function findNodes(map: string[][]) {
	const nodes: Map<string, Map<string, number>> = new Map()
	for (let x = 1; x < map.length - 1; x++) {
		for (let y = 1; y < map.length - 1; y++) {
			if (map[y][x] === '#') continue
			const nodeGrid = toGrid(x, y)
			if (nodes.has(nodeGrid)) continue
			const options = getNodeOptions(map, x, y)
			if (!options) continue
			const nodeMap: Map<string, number> = new Map()
			nodes.set(nodeGrid, nodeMap)
			for (const [ox, oy, dir] of options) {
				let lastDir = dir
				let distance = 1
				let hx = ox
				let hy = oy
				while (true) {
					for (let n = 0; n < 4; n++) {
						if (opposites[n] === lastDir) continue
						const [nx, ny] = neighborXYs[n]
						if (map[hy + ny][hx + nx] === '#') continue
						hx += nx
						hy += ny
						distance++
						lastDir = n
						break
					}
					if (hy === 0 || hy === map.length - 1) break
					if (nodes.has(toGrid(hx, hy))) break
					if (getNodeOptions(map, hx, hy)) break
				}
				// If node leads to the end, remove all other options
				if (hy === map.length - 1) nodeMap.clear()
				nodeMap.set(toGrid(hx, hy), distance)
				if (hy === map.length - 1) break
			}
		}
	}
	return nodes
}

function findLongestPath(
	nodes: Map<string, Map<string, number>>,
	cache: Map<string, number>,
	nodeGrid: string,
	nodesVisited: Set<string>,
	endGrid: string
) {
	// const cacheKey = `${[...nodesVisited].sort()}:${nodeGrid}`
	// const cached = cache.get(cacheKey)
	// if (cached) {
	// 	// console.log('cache hit', cacheKey)
	// 	return cached
	// }
	nodesVisited.add(nodeGrid)
	if (nodeGrid === endGrid) return 0
	let longestPath: number = -Infinity
	const node = nodes.get(nodeGrid)!
	for (const [optionGrid, optionDistance] of node) {
		if (nodesVisited.has(optionGrid)) continue
		const optionPath =
			optionDistance +
			findLongestPath(nodes, cache, optionGrid, new Set([...nodesVisited]), endGrid)
		if (optionPath > longestPath) longestPath = optionPath
	}
	// cache.set(cacheKey, longestPath)
	return longestPath
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const map = parseInput(input)
	const nodes = findNodes(map)
	const startGrid = '1:0'
	const firstNode = [...nodes].find(([, c]) => c.has(startGrid))!
	const initialDistance = firstNode[1].get(startGrid)!
	firstNode[1].delete(startGrid)
	const firstGrid = firstNode[0]
	const endGrid = toGrid(map.length - 2, map.length - 1)
	const longestPath =
		initialDistance + findLongestPath(nodes, new Map(), firstGrid, new Set(), endGrid)
	return longestPath
}

export const part2Examples: Example[] = [[part1Examples[0][0], '154']]
