import { getNeighbors } from '../util'

const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split('') as ('@' | '.')[])
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const parsed = parseInput(input)
	const width = parsed[0].length
	const height = parsed.length
	let valid = 0
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (parsed[y][x] === '.') continue
			const neighbors = getNeighbors(x, y, 8)
			let neighborRolls = 0
			for (const [nx, ny] of neighbors) {
				if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
				if (parsed[ny][nx] === '@') neighborRolls++
				if (neighborRolls === 4) break
			}
			if (neighborRolls < 4) valid++
		}
	}
	return valid
}

export const part1Examples: Example[] = [
	[
		`..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
		'13',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	const width = parsed[0].length
	const height = parsed.length
	let valid = 0
	let rollRemoved = false
	do {
		rollRemoved = false
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (parsed[y][x] === '.') continue
				const neighbors = getNeighbors(x, y, 8)
				let neighborRolls = 0
				for (const [nx, ny] of neighbors) {
					if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
					if (parsed[ny][nx] === '@') neighborRolls++
					if (neighborRolls === 4) break
				}
				if (neighborRolls < 4) {
					valid++
					parsed[y][x] = '.'
					rollRemoved = true
				}
			}
		}
	} while (rollRemoved)

	return valid
}

export const part2Examples: Example[] = [[part1Examples[0][0], '43']]
