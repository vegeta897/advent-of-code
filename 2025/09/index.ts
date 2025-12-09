import { XY } from '../util'

const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(',').map((v) => +v) as XY)
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const coords = parseInput(input)
	let biggest = 0
	for (let i = 0; i < coords.length; i++) {
		const a = coords[i]
		for (let j = 0; j < coords.length; j++) {
			if (i === j) continue
			const b = coords[j]
			const width = Math.abs(a[0] - b[0]) + 1
			const height = Math.abs(a[1] - b[1]) + 1
			const area = width * height
			if (area > biggest) biggest = area
		}
	}
	return biggest
}

export const part1Examples: Example[] = [
	[
		`7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
		'50',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const coords = parseInput(input)
	const horizontals: Map<number, [x1: number, x2: number]> = new Map()
	const verticals: Map<number, [y1: number, y2: number]> = new Map()
	let prevCoord = coords.at(-1)!
	// let d = `M${prevCoord[0]},${prevCoord[1]}`
	for (let i = 0; i < coords.length; i++) {
		const coord = coords[i]
		// d += `L${coord[0]},${coord[1]}`
		// console.log(coord)
		if (coord[0] === prevCoord[0]) {
			verticals.set(coord[0], [
				Math.min(prevCoord[1], coord[1]),
				Math.max(prevCoord[1], coord[1]),
			])
		} else {
			horizontals.set(coord[1], [
				Math.min(prevCoord[0], coord[0]),
				Math.max(prevCoord[0], coord[0]),
			])
		}
		prevCoord = coord
	}
	// console.log(d)
	let biggest = 0
	// let biggestRect = ''
	for (let i = 0; i < coords.length; i++) {
		const a = coords[i]
		for (let j = 0; j < coords.length; j++) {
			if (i === j) continue
			const b = coords[j]
			const width = Math.abs(a[0] - b[0]) + 1
			const height = Math.abs(a[1] - b[1]) + 1
			const area = width * height
			if (area > biggest) {
				const rx1 = Math.min(a[0], b[0])
				const rx2 = Math.max(a[0], b[0])
				const ry1 = Math.min(a[1], b[1])
				const ry2 = Math.max(a[1], b[1])
				let valid = true
				for (const [ly, [lx1, lx2]] of horizontals) {
					if (ly <= ry1 || ly >= ry2) continue
					if (
						(lx1 > rx1 && lx1 < rx2) ||
						(lx2 > rx1 && lx2 < rx2) ||
						(lx1 <= rx1 && lx2 >= rx2)
					) {
						valid = false
						break
					}
				}
				if (!valid) continue
				for (const [lx, [ly1, ly2]] of verticals) {
					if (lx <= rx1 || lx >= rx2) continue
					if (
						(ly1 > ry1 && ly1 < ry2) ||
						(ly2 > ry1 && ly2 < ry2) ||
						(ly1 <= ry1 && ly2 >= ry2)
					) {
						valid = false
						break
					}
				}
				if (valid) {
					biggest = area
					// biggestRect = `<path fill="#0ff4" d="M${rx1},${ry1} H${rx2} V${ry2} H${rx1}"></path>`
				}
			}
		}
	}
	// console.log(biggestRect)
	return biggest
}

export const part2Examples: Example[] = [[part1Examples[0][0], '24']]
