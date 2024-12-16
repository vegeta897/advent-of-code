import {
	addXY,
	Direction,
	flipDir,
	getNeighbors,
	NEIGHBOR_XY_4WAY,
	toGrid,
	toXY,
	XY,
} from '../util'

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
				return v === '.' ? 0 : 1
			})
		)
	if (!startXY || !endXY) throw 'start/end not found!'
	return { map, startXY, endXY }
}

const buildNodeGraph = (map: number[][], startGrid: string, endGrid: string) => {
	const nodeGridList: Set<string> = new Set([startGrid, endGrid])
	for (let y = 1; y < map.length - 1; y++) {
		const row = map[y]
		for (let x = 1; x < row.length - 1; x++) {
			if (row[x] === 1) continue
			const openNeighbors = getNeighbors(x, y).filter(([nx, ny]) => map[ny][nx] === 0)
			if (openNeighbors.length > 2) nodeGridList.add(toGrid(x, y))
		}
	}
	const nodeGraph: NodeGraph = new Map()
	nodeGridList.forEach((iGrid) => nodeGraph.set(iGrid, new Map()))
	const openNodes: Set<string> = new Set([startGrid])
	const closedNodes: Set<string> = new Set()
	while (openNodes.size > 0) {
		const fromNode = [...openNodes][0]
		const fromNodeXY = toXY(fromNode)
		const fromNetworkNode = nodeGraph.get(fromNode)!
		const exploredDirs = [...fromNetworkNode].map(([, { startDir }]) => startDir)
		openNodes.delete(fromNode)
		closedNodes.add(fromNode)
		for (let startDir = 0; startDir < 4; startDir++) {
			if (exploredDirs.includes(startDir)) continue
			const firstStepXY = addXY(fromNodeXY, NEIGHBOR_XY_4WAY[startDir])
			const firstStepTile = map[firstStepXY[1]][firstStepXY[0]]
			if (firstStepTile === 1) continue
			let currentDir = startDir
			let currentXY = firstStepXY
			let steps = 1
			let turns = 0
			let intersectionFound = false
			const grids = [fromNode, toGrid(...firstStepXY)]
			while (!intersectionFound) {
				let nextStepFound = false
				for (let turn = -1; turn <= 1; turn++) {
					const nextDir = (currentDir + 4 + turn) % 4
					const nextStepXY = addXY(currentXY, NEIGHBOR_XY_4WAY[nextDir])
					const nextStepGrid = toGrid(...nextStepXY)
					if (nodeGraph.has(nextStepGrid)) {
						if (nextStepGrid === fromNode) break
						steps++
						if (turn !== 0) turns++
						const cost = turns * 1000 + steps
						grids.push(nextStepGrid)
						fromNetworkNode.set(`${nextStepGrid}~${startDir}`, {
							startDir,
							cost,
							endDir: nextDir,
							grids,
						})
						intersectionFound = true
						if (!closedNodes.has(nextStepGrid)) openNodes.add(nextStepGrid)
						break
					}
					const nextStepTile = map[nextStepXY[1]][nextStepXY[0]]
					if (nextStepTile === 1) continue
					nextStepFound = true
					steps++
					if (turn !== 0) turns++
					currentDir = nextDir
					currentXY = nextStepXY
					grids.push(nextStepGrid)
					break
				}
				if (!nextStepFound) {
					// dead end
					break
				}
			}
		}
	}
	while (true) {
		let nodesRemoved = 0
		nodeGraph.forEach((node, nodeGrid) => {
			if (nodeGrid === startGrid || nodeGrid === endGrid) return
			if (node.size === 1) {
				nodeGraph.forEach((compareNode) => {
					compareNode.forEach((_, hash) => {
						if (hash.split('~')[0] === nodeGrid) compareNode.delete(hash)
					})
				})
				nodeGraph.delete(nodeGrid)
				nodesRemoved++
			}
		})
		if (nodesRemoved === 0) break
	}
	return nodeGraph
}

type PathNode = {
	grid: string
	hash: string
	dir: number
	score: number
	grids: string[]
}

const findPath = (map: number[][], start: XY, end: XY) => {
	const startGrid = toGrid(...start)
	const endGrid = toGrid(...end)
	const network = buildNodeGraph(map, startGrid, endGrid)
	let current: PathNode = {
		grid: startGrid,
		hash: `${startGrid}:${Direction.right}`,
		dir: Direction.right,
		score: 0,
		grids: [startGrid],
	}
	const openTiles: Map<string, PathNode> = new Map([[current.hash, current]])
	const bestHashScores: Map<string, [number, Set<string>]> = new Map()
	let lowestScore = Infinity
	let bestGrids: Set<string> = new Set()
	while (openTiles.size > 0) {
		openTiles.delete(current.hash)
		const networkNode = network.get(current.grid)!
		for (const [nextNodeHash, nextNodeInfo] of networkNode) {
			const [nextNodeGrid] = nextNodeHash.split('~')
			if (nextNodeInfo.startDir === flipDir(current.dir)) continue
			const cost = nextNodeInfo.cost
			const turnCost = nextNodeInfo.startDir === current.dir ? 0 : 1000
			let score = current.score + cost + turnCost
			const nextNodeEndHash = `${nextNodeGrid}~${nextNodeInfo.endDir}`
			const bestHashScore = bestHashScores.get(nextNodeEndHash)
			const grids = new Set([...current.grids, ...nextNodeInfo.grids])
			if (bestHashScore) {
				if (bestHashScore[0] < score) {
					continue
				} else if (bestHashScore[0] === score) {
					bestHashScore[1].forEach((g) => grids.add(g))
				}
			}
			bestHashScores.set(nextNodeEndHash, [score, grids])
			if (nextNodeGrid === endGrid) {
				if (score < lowestScore) {
					lowestScore = score
					bestGrids = new Set(grids)
				} else if (score === lowestScore) {
					grids.forEach((grid) => bestGrids.add(grid))
				}
				break
			}
			const toNode: PathNode = {
				grid: nextNodeGrid,
				hash: nextNodeEndHash,
				dir: nextNodeInfo.endDir,
				score,
				grids: [...grids],
			}
			openTiles.set(toNode.hash, toNode)
		}
		current = getLowestScoreTile(openTiles)
	}
	return [lowestScore, bestGrids] as [number, Set<string>]
}

function getLowestScoreTile(list: Map<string, PathNode>) {
	let best
	for (const [, value] of list) {
		if (!best || value.score < best.score) {
			best = value
		}
	}
	return best!
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { map, startXY, endXY } = parseInput(input)
	const [lowestScore] = findPath(map, startXY, endXY)
	return lowestScore
}

export const part1Examples: Example[] = [
	[
		`###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
		'7036',
	],
	[
		`#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
		'11048',
	],
]

type NodeGraph = Map<
	string,
	Map<string, { startDir: number; cost: number; endDir: number; grids: string[] }>
>

export const getPart2Answer: Answer = (input, example = false) => {
	const { map, startXY, endXY } = parseInput(input)
	const [, bestPathGrids] = findPath(map, startXY, endXY)
	return bestPathGrids.size
}

export const part2Examples: Example[] = [
	[part1Examples[0][0], '45'],
	[part1Examples[1][0], '64'],
]
