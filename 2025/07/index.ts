const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(''))
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	let splitCount = 0
	for (let i = 1; i < parsed.length; i++) {
		const prevRow = parsed[i - 1]
		const row = parsed[i]
		for (let j = 0; j < row.length; j++) {
			const prevChar = prevRow[j]
			const char = row[j]
			if (prevChar === 'S' || prevChar === '|') {
				if (char === '.' || char === '|') {
					row[j] = '|'
				} else {
					row[j - 1] = '|'
					row[j + 1] = '|'
					splitCount++
				}
			}
		}
	}
	return splitCount
}

export const part1Examples: Example[] = [
	[
		`.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
		'21',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	const beams: number[] = []
	beams[parsed[0].indexOf('S')] = 1
	for (let i = 1; i < parsed.length; i++) {
		const row = parsed[i]
		for (let c = 0; c < row.length; c++) {
			const char = row[c]
			if (char === '^') {
				beams[c - 1] = (beams[c - 1] || 0) + beams[c]
				beams[c + 1] = (beams[c + 1] || 0) + beams[c]
				beams[c] = 0
			}
		}
	}
	return beams.reduce((p, c) => p + c)
}

export const part2Examples: Example[] = [[part1Examples[0][0], '40']]
