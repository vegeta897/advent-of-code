import { NEIGHBOR_XY_4WAY, XY } from '../util'

const parseInput = (input: string) => {
	const trailHeads: XY[] = []
	const trailEnds: XY[] = []
	return {
		map: input
			.trim()
			.split('\n')
			.map((line, y) =>
				line.split('').map((v, x) => {
					if (+v === 0) trailHeads.push([x, y])
					if (+v === 9) trailEnds.push([x, y])
					return +v
				})
			),
		trailHeads,
		trailEnds,
	}
}

const findAllPaths = (
	map: number[][],
	startX: number,
	startY: number,
	endX: number,
	endY: number
) => {
	const startHeight = map[startY][startX]
	const mapSize = map.length
	let sum = 0
	for (let n = 0; n < 4; n++) {
		const [nx, ny] = NEIGHBOR_XY_4WAY[n]
		const toX = startX + nx
		const toY = startY + ny
		if (toX < 0 || toY < 0 || toX === mapSize || toY === mapSize) continue
		const toHeight = map[toY][toX]
		if (toHeight !== startHeight + 1) continue
		if (toX === endX && toY === endY) {
			sum++
		} else {
			sum += findAllPaths(map, toX, toY, endX, endY)
		}
	}
	return sum
}

const scoreTrailhead = (
	map: number[][],
	trailHead: XY,
	trailEnds: XY[],
	scoreAll = false
) => {
	let score = 0
	for (const trailEnd of trailEnds) {
		const paths = findAllPaths(map, ...trailHead, ...trailEnd)
		if (paths > 0) {
			score += scoreAll ? paths : 1
		}
	}
	return score
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { map, trailHeads, trailEnds } = parseInput(input)
	let score = 0
	for (const trailHead of trailHeads) {
		score += scoreTrailhead(map, trailHead, trailEnds)
	}
	return score
}

export const part1Examples: Example[] = [
	[
		`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
		'36',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const { map, trailHeads, trailEnds } = parseInput(input)
	let score = 0
	for (const trailHead of trailHeads) {
		score += scoreTrailhead(map, trailHead, trailEnds, true)
	}
	return score
}

export const part2Examples: Example[] = [[part1Examples[0][0], '81']]
