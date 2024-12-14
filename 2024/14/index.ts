import { addXY, printMap, scaleXY, XY } from '../util'

const parseInput = (input: string, width: number, height: number) => {
	return input
		.trim()
		.split('\n')
		.map(
			(line) =>
				line.split(' ').map(
					(c) =>
						c
							.split('=')[1]
							.split(',')
							.map((v) => +v) as XY
				) as [XY, XY]
		)
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const width = example ? 11 : 101
	const height = example ? 7 : 103
	const parsed = parseInput(input, width, height)
	const finalPositions = parsed.map(([position, velocity]) =>
		addXY(position, scaleXY(velocity, 100))
	)
	let safety = 0
	const quads = [0, 0, 0, 0]
	for (const [x, y] of finalPositions) {
		const realX = (x + width * 10000) % width
		const realY = (y + height * 10000) % height
		if (realX < Math.floor(width / 2)) {
			if (realY < Math.floor(height / 2)) quads[0]++
			else if (realY >= Math.ceil(height / 2)) quads[1]++
		} else if (realX >= Math.ceil(width / 2)) {
			if (realY < Math.floor(height / 2)) quads[2]++
			else if (realY >= Math.ceil(height / 2)) quads[3]++
		}
	}
	return quads[0] * quads[1] * quads[2] * quads[3]
}

export const part1Examples: Example[] = [
	[
		`p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
		'12',
	],
]

const moduloXY = (a: XY, b: XY): XY => [a[0] % b[0], a[1] % b[1]]

export const getPart2Answer: Answer = (input, example = false) => {
	const width = 101
	const height = 103
	const parsed = parseInput(input, width, height)
	// let bigMapString = ''
	for (let i = 0; i < 10000; i++) {
		const map: string[][] = new Array(height)
			.fill(0)
			.map((_) => new Array(width).fill(' '))
		for (let r = 0; r < parsed.length; r++) {
			const robot = parsed[r]
			const [position, velocity] = robot
			const [x, y] = moduloXY(addXY(addXY(position, velocity), [width, height]), [
				width,
				height,
			])
			map[y][x] = '#'
			robot[0] = [x, y]
		}
		// bigMapString += `\n#${i + 1}`
		// bigMapString += map.map((row) => row.join('')).join('\n')
		for (const row of map) {
			if (row.join('').includes('###############################')) {
				return i + 1
			}
		}
	}
	// Bun.write('2024/14/maps.log', bigMapString)
	throw 'christmas tree not found!'
}

export const part2Examples: Example[] = []
