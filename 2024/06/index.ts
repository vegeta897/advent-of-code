import { DIRS, rotateXYCW, toGrid, toXY, XY } from '../util'

const parseInput = (input: string) => {
	let start: XY | undefined
	const map = input
		.trim()
		.split('\n')
		.map((line, y) =>
			line.split('').map((v, x) => {
				if (v === '^') {
					start = [x, y]
					return '.'
				}
				return v
			})
		)
	if (!start) throw 'start not found!'
	return { map, start }
}

const inBounds = (position: XY, map: string[][]) =>
	position[0] >= 0 &&
	position[1] >= 0 &&
	position[0] < map[0].length &&
	position[1] < map.length

const move = (map: string[][], position: XY, dir: number): [XY, number] => {
	let nextX: number
	let nextY: number
	while (true) {
		nextX = position[0] + DIRS[dir][0]
		nextY = position[1] + DIRS[dir][1]
		const obstacle = inBounds([nextX, nextY], map) && map[nextY][nextX] === '#'
		if (obstacle) dir = (dir + 1) % 4
		else break
	}
	return [[nextX, nextY], dir]
}

const getDefaultPath = (map: string[][], start: XY) => {
	let position: XY = [...start]
	let dir = 0
	const visitedGrids: Set<string> = new Set()
	while (inBounds(position, map)) {
		visitedGrids.add(toGrid(...position))
		const [newPosition, newDir] = move(map, position, dir)
		position = newPosition
		dir = newDir
	}
	return visitedGrids
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { map, start } = parseInput(input)
	const visitedGrids = getDefaultPath(map, start)
	return visitedGrids.size
}

export const part1Examples: Example[] = [
	[
		`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
		'41',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const { map, start } = parseInput(input)
	const width = map[0].length
	const height = map.length
	const obstacleCandidates = getDefaultPath(map, start)
	let loops = 0
	obstacleCandidates.forEach((obstacleGrid) => {
		const [blockX, blockY] = toXY(obstacleGrid)
		const mapClone = map.map((line) => [...line])
		mapClone[blockY][blockX] = '#'
		let position: XY = [...start]
		let dir = 0
		let panic = 0
		while (inBounds(position, map)) {
			if (panic++ > width * height) {
				loops++
				break
			}
			const [newPosition, newDir] = move(mapClone, position, dir)
			position = newPosition
			dir = newDir
		}
	})
	return loops
}

export const part2Examples: Example[] = [[part1Examples[0][0], '6']]
