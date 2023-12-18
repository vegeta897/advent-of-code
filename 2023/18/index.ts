const parseInput = (input: string, p2 = false) =>
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [dirString, metersString, hexString] = line.split(' ')
			const hex = hexString.slice(2, 8)
			return {
				dir: p2
					? +hex.at(-1)!
					: letterDirToEnum[dirString as keyof typeof letterDirToEnum],
				meters: p2 ? parseInt(hex.slice(0, 5), 16) : +metersString,
			}
		})

enum DIR {
	right = 0,
	down = 1,
	left = 2,
	up = 3,
}

const letterDirToEnum = {
	U: DIR.up,
	D: DIR.down,
	R: DIR.right,
	L: DIR.left,
}

const neighborXYs = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
]

export const part1Examples: Example[] = [
	[
		`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`,
		'62',
	],
]

type Range = [start: number, end: number]

const getOverlapWidth = (a: Range, b: Range) =>
	Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]) + 1)

function getTotalArea(lines: ReturnType<typeof parseInput>) {
	const hStopsByY: Map<number, number[]> = new Map()
	let x = 0
	let y = 0
	for (const line of lines) {
		const [dx, dy] = neighborXYs[line.dir]
		const endX = x + dx * line.meters
		const endY = y + dy * line.meters
		if (dx !== 0) {
			const hLine: Range = endX > x ? [x, endX] : [endX, x]
			const hStopsAtY = hStopsByY.get(y)
			if (hStopsAtY) {
				hStopsAtY!.push(...hLine)
			} else {
				hStopsByY.set(y, hLine)
			}
		}
		x = endX
		y = endY
	}
	const hLineYs = [...hStopsByY.keys()].sort((a, b) => a - b)
	let waterfallY = hLineYs[0]
	const waterStops: number[] = hStopsByY.get(hLineYs.shift()!)!
	let totalArea = 0
	let prevWaterRanges: Range[] = [[waterStops[0], waterStops[1]]]
	for (const hLineY of hLineYs) {
		const height = hLineY - waterfallY + 1
		for (let w = 1; w < waterStops.length; w += 2) {
			const start = waterStops[w - 1]
			const stop = waterStops[w]
			const width = stop - start + 1
			const area = width * height
			totalArea += area
		}
		const stops = hStopsByY.get(hLineY)!.sort((a, b) => a - b)
		for (let s = 0; s < stops.length; s++) {
			const stop = stops[s]
			const foundWaterStopIndex = waterStops.indexOf(stop)
			if (foundWaterStopIndex >= 0) waterStops.splice(foundWaterStopIndex, 1)
			else waterStops.push(stop)
		}
		waterStops.sort((a, b) => a - b)
		const newWaterRanges: Range[] = []
		for (let w = 1; w < waterStops.length; w += 2) {
			const range: Range = [waterStops[w - 1], waterStops[w]]
			newWaterRanges.push(range)
			for (const prevWaterRange of prevWaterRanges) {
				const a = range[0] <= prevWaterRange[0] ? range : prevWaterRange
				const b = a === prevWaterRange ? range : prevWaterRange
				totalArea -= getOverlapWidth(a, b)
			}
		}
		prevWaterRanges = newWaterRanges
		waterfallY = hLineY
	}
	return totalArea
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const lines = parseInput(input)
	return getTotalArea(lines)
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const lines = parseInput(input, true)
	return getTotalArea(lines)
}

export const part2Examples: Example[] = [[part1Examples[0][0], '952408144115']]
