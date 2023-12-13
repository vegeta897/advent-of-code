const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n\n')
		.map((puzzle) => {
			const rows = puzzle.split('\n')
			const width = rows[0].length
			const mapByColumn: string[][] = []
			const mapByRow = rows.map((line, y) => {
				return line.split('').map((char, x) => {
					if (!mapByColumn[x]) mapByColumn[x] = []
					mapByColumn[x][y] = char
					return char
				})
			})
			return { mapByRow, mapByColumn, width, height: rows.length }
		})
}

function getMirror(map: string[][], size: number) {
	for (let i = 1; i < size; i++) {
		const sideSize = Math.min(i, size - i)
		const sideStartIndex = i - sideSize
		const fullSize = sideSize * 2
		const isMirror = map.every((line) => {
			const side1 = line.slice(sideStartIndex, sideStartIndex + sideSize)
			const side2 = line.slice(sideStartIndex + sideSize, sideStartIndex + fullSize)
			return side1.every((c, s) => c === side2.at(-1 - s))
		})
		if (isMirror) return i
	}
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	let total = 0
	for (const { mapByRow, mapByColumn, width, height } of parsed) {
		const vertMirrorAt = getMirror(mapByRow, width)
		if (vertMirrorAt) {
			total += vertMirrorAt
			continue // mirror can't be on both axes
		}
		const horizMirrorAt = getMirror(mapByColumn, height)
		if (horizMirrorAt) {
			total += horizMirrorAt * 100
		}
	}
	return total
}

export const part1Examples: Example[] = [
	[
		`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
		'405',
	],
]

function getSmudgedMirror(map: string[][], size: number) {
	for (let i = 1; i < size; i++) {
		let differences = 0
		const sideSize = Math.min(i, size - i)
		const sideStartIndex = i - sideSize
		const fullSize = sideSize * 2
		for (const line of map) {
			const side1 = line.slice(sideStartIndex, sideStartIndex + sideSize)
			const side2 = line.slice(sideStartIndex + sideSize, sideStartIndex + fullSize)
			side1.forEach((c, s) => {
				if (c !== side2.at(-1 - s)) differences++
			})
			if (differences > 1) break
		}
		if (differences === 1) return i
	}
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	let total = 0
	for (const { mapByRow, mapByColumn, width, height } of parsed) {
		const vertMirrorAt = getSmudgedMirror(mapByRow, width)
		if (vertMirrorAt) {
			total += vertMirrorAt
			continue // mirror can't be on both axes
		}
		const horizMirrorAt = getSmudgedMirror(mapByColumn, height)
		if (horizMirrorAt) {
			total += horizMirrorAt * 100
		}
	}
	return total
}

export const part2Examples: Example[] = [[part1Examples[0][0], '400']]
