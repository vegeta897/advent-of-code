import { XY } from '../util'

const examplePairAreas: XY[] = [
	[5, 3],
	[0, 0],
	[6, 3],
	[0, 0],
	[4, 4],
	[5, 4],
]
const inputPairAreas: XY[] = [
	[5, 4],
	[5, 4],
	[4, 4],
	[5, 3],
	[4, 3],
	[4, 3],
]

const parseInput = (input: string, example = false) => {
	const textChunks = input.trim().split('\n\n')
	const regions = textChunks
		.pop()!
		.split('\n')
		.map((line) => {
			const [size, shapeCountString] = line.split(': ')
			const shapeCounts = shapeCountString.split(' ').map((v) => +v)
			return {
				size: size.split('x').map((v) => +v) as XY,
				shapeCounts,
				totalShapes: shapeCounts.reduce((p, c) => p + c),
			}
		})
	const pairAreas = example ? examplePairAreas : inputPairAreas
	const shapes = textChunks.map((chunk, c) => {
		const lines = chunk.split('\n')
		lines.shift()
		let area = 0
		const map = lines.map((line) => {
			const row = line.split('')
			row.forEach((char) => {
				if (char === '#') area++
			})
			return row
		})
		return { map, area, pairedArea: pairAreas[c] }
	})
	return { regions, shapes }
}

function fitShapes(
	shapes: ReturnType<typeof parseInput>['shapes'],
	region: ReturnType<typeof parseInput>['regions'][number]
) {
	const [rWidth, rHeight] = region.size
	let x = 0
	let y = 0
	let fits = true
	for (let s = 0; s < region.shapeCounts.length; s++) {
		const shape = shapes[s]
		const [pWidth, pHeight] = shape.pairedArea
		let count = region.shapeCounts[s]
		let rowHeight = 3
		while (count > 0) {
			let placing = 1
			let widthNeeded = 3
			let heightNeeded = 3
			const widthLeft = rWidth - x
			const heightLeft = rHeight - y
			if (count > 1 && pWidth <= widthLeft && pHeight <= heightLeft) {
				placing = 2
				widthNeeded = pWidth
				heightNeeded = pHeight
				rowHeight = pHeight
			}
			if (widthLeft < widthNeeded) {
				x = 0
				y += rowHeight
				rowHeight = 3
				continue
			}
			if (heightLeft < heightNeeded) {
				fits = false
				break
			}
			x += widthNeeded
			count -= placing
		}
		if (!fits) break
	}
	return fits
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const { regions, shapes } = parseInput(input, example)
	let total = 0
	for (let r = 0; r < regions.length; r++) {
		const region = regions[r]
		const [rWidth, rHeight] = region.size
		const regionArea = rWidth * rHeight
		let totalShapesArea = 0
		for (let s = 0; s < region.shapeCounts.length; s++) {
			const count = region.shapeCounts[s]
			const multipliedShapeArea = shapes[s].area * count
			totalShapesArea += multipliedShapeArea
		}
		if (totalShapesArea > regionArea) {
			// The shapes can't possibly fit in this region
			continue
		}
		const maxShapesWide = Math.floor(rWidth / 3)
		const maxShapesTall = Math.floor(rHeight / 3)
		const maxShapesInGrid = maxShapesWide * maxShapesTall
		if (region.totalShapes <= maxShapesInGrid) {
			// The shapes can fit trivially in a grid arrangement
			total++
			continue
		}
		const fits = fitShapes(shapes, region)
		if (fits) {
			total++
			continue
		}
		region.size.reverse()
		const fitsRotated = fitShapes(shapes, region)
		if (fitsRotated) {
			total++
		}
	}
	return total
}

export const part1Examples: Example[] = [
	[
		`0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`,
		'2',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	// const parsed = parseInput(input)
	return ''
}

export const part2Examples: Example[] = [[part1Examples[0][0], '']]
