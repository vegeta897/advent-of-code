const parseInput = (input: string) => {
	const wordGrid = input
		.trim()
		.split('\n')
		.map((line) => line.split('')) as ('X' | 'M' | 'A' | 'S')[][]
	return { wordGrid, width: wordGrid[0].length, height: wordGrid.length }
}

const neighbors = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
]

export const getPart1Answer: Answer = (input, example = false) => {
	const { wordGrid, width, height } = parseInput(input)
	let found = 0
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const value = wordGrid[y][x]
			if (value !== 'X') continue
			for (const [nx, ny] of neighbors) {
				if (
					x + nx * 3 < 0 ||
					y + ny * 3 < 0 ||
					x + nx * 3 >= width ||
					y + ny * 3 >= height
				)
					continue
				if (wordGrid[y + ny * 1][x + nx * 1] !== 'M') continue
				if (wordGrid[y + ny * 2][x + nx * 2] !== 'A') continue
				if (wordGrid[y + ny * 3][x + nx * 3] !== 'S') continue
				found++
			}
		}
	}
	return found
}

export const part1Examples: Example[] = [
	[
		`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
		'18',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const { wordGrid, width, height } = parseInput(input)
	let found = 0
	for (let x = 1; x < width - 1; x++) {
		for (let y = 1; y < height - 1; y++) {
			if (wordGrid[y][x] !== 'A') continue
			const downward = wordGrid[y - 1][x - 1] + wordGrid[y + 1][x + 1]
			if (downward !== 'MS' && downward !== 'SM') continue
			const upward = wordGrid[y + 1][x - 1] + wordGrid[y - 1][x + 1]
			if (upward !== 'MS' && upward !== 'SM') continue
			found++
		}
	}
	return found
}

export const part2Examples: Example[] = [
	[
		`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
		'9',
	],
]
