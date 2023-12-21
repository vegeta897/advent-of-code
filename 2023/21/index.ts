const parseInput = (input: string) => {
	let startXY: [number, number]
	const map = input
		.trim()
		.split('\n')
		.map((line, y) => {
			const cols = line.split('')
			for (let x = 0; x < cols.length; x++) {
				if (!startXY && cols[x] === 'S') {
					startXY = [x, y]
					cols[x] = '.'
				}
			}
			return cols
		})
	return { map, size: map.length, startXY: startXY! }
}

const neighborXYs = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
]
const toGrid = (x: number, y: number) => `${x}:${y}`
const toMemory = (x: number, y: number, stepsLeft: number) => `${x}:${y}:${stepsLeft}`

function walk(
	map: string[][],
	xy: [number, number],
	endPlots: Set<string>,
	memory: Set<string>,
	stepsLeft: number
) {
	memory.add(toMemory(...xy, stepsLeft))
	if (stepsLeft === 0) {
		endPlots.add(toGrid(...xy))
		return
	}
	for (let n = 0; n < 4; n++) {
		const [nx, ny] = neighborXYs[n]
		const toX = xy[0] + nx
		const toY = xy[1] + ny
		if (toX < 0 || toY < 0 || toX === map.length || toY === map.length) continue
		if (map[toY][toX] !== '.') continue
		if (memory.has(toMemory(toX, toY, stepsLeft - 1))) continue
		walk(map, [toX, toY], endPlots, memory, stepsLeft - 1)
	}
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { map, size, startXY } = parseInput(input)
	const steps = size === 11 ? 6 : 64
	return getPlots(map, startXY, steps)
}

export const part1Examples: Example[] = [
	[
		`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
		'16',
	],
]

function getPlots(map: string[][], xy: [number, number], steps: number) {
	const endPlots: Set<string> = new Set()
	const memory: Set<string> = new Set()
	walk(map, xy, endPlots, memory, steps)
	return endPlots.size
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const { map, size, startXY } = parseInput(input)
	const steps = size === 5 ? 17 : 26501365
	const stepsForEvenPlots = size === 5 ? 4 : 130 // yeah whatever
	const stepsForOddPlots = size === 5 ? 3 : 129
	const mapReach = Math.floor(steps / size)
	const stepsToMiddleEdge = Math.floor(size / 2) + 1
	const stepsToCorner = size + 1
	const straightReach = Math.floor((steps - stepsToMiddleEdge) / size)
	const diagonalReach = Math.floor((steps - stepsToCorner) / size)
	const straightStepsLeft = steps - stepsToMiddleEdge - straightReach * size
	const innerCornerStepsLeft = steps - stepsToCorner - (diagonalReach - 1) * size
	const outerCornerStepsLeft = steps - stepsToCorner - diagonalReach * size
	const westPlots = getPlots(map, [size - 1, startXY[1]], straightStepsLeft)
	const eastPlots = getPlots(map, [0, startXY[1]], straightStepsLeft)
	const southPlots = getPlots(map, [startXY[0], 0], straightStepsLeft)
	const northPlots = getPlots(map, [startXY[0], size - 1], straightStepsLeft)
	const straightPlots = westPlots + eastPlots + southPlots + northPlots
	const innerNEplots = getPlots(map, [0, size - 1], innerCornerStepsLeft)
	const innerSEplots = getPlots(map, [0, 0], innerCornerStepsLeft)
	const innerNWplots = getPlots(map, [size - 1, size - 1], innerCornerStepsLeft)
	const innerSWplots = getPlots(map, [size - 1, 0], innerCornerStepsLeft)
	const innerCornerPlots = innerNEplots + innerSEplots + innerNWplots + innerSWplots
	const outerNEplots = getPlots(map, [0, size - 1], outerCornerStepsLeft)
	const outerSEplots = getPlots(map, [0, 0], outerCornerStepsLeft)
	const outerNWplots = getPlots(map, [size - 1, size - 1], outerCornerStepsLeft)
	const outerSWplots = getPlots(map, [size - 1, 0], outerCornerStepsLeft)
	const outerCornerPlots = outerNEplots + outerSEplots + outerNWplots + outerSWplots
	const evenMapPlots = getPlots(map, startXY, stepsForEvenPlots)
	const oddMapPlots = getPlots(map, startXY, stepsForOddPlots)
	let fullyMappedPlots = oddMapPlots
	for (let i = 1; i <= mapReach - 1; i++) {
		const mapsInRing = i * 4
		fullyMappedPlots += mapsInRing * (i % 2 === 0 ? oddMapPlots : evenMapPlots)
	}
	const outerDiagonalMaps = diagonalReach + 1
	const innerDiagonalMaps = diagonalReach
	return (
		fullyMappedPlots +
		straightPlots +
		outerCornerPlots * outerDiagonalMaps +
		innerCornerPlots * innerDiagonalMaps
	)
}

export const part2Examples: Example[] = [
	[
		`.....
.....
..S..
.....
.....`,
		'324',
	],
	/*[part1Examples[0][0], '1594']*/
]
