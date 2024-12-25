const parseInput = (input: string) => {
	const parsed: { locks: number[][]; keys: number[][] } = {
		locks: [],
		keys: [],
	}
	input
		.trim()
		.split('\n\n')
		.map((lockOrKeyStr) => {
			const rows = lockOrKeyStr.split('\n')
			const type = rows[0] === '#####' ? 'locks' : 'keys'
			const heights = []
			for (let col = 0; col < 5; col++) {
				const height = rows.map((row) => row[col]).filter((v) => v === '#').length - 1
				heights.push(height)
			}
			parsed[type].push(heights)
		})
	return parsed
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { locks, keys } = parseInput(input)
	let matches = 0
	for (const lock of locks) {
		for (const key of keys) {
			let incompatible = false
			for (let c = 0; c < 5; c++) {
				if (lock[c] + key[c] > 5) {
					incompatible = true
					break
				}
			}
			if (!incompatible) matches++
		}
	}
	return matches
}

export const part1Examples: Example[] = [
	[
		`#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`,
		'3',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	// const parsed = parseInput(input)
	return ''
}

export const part2Examples: Example[] = []
