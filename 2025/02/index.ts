const parseInput = (input: string) => {
	return input
		.trim()
		.split(',')
		.map((r) => r.split('-').map((v) => +v) as [number, number])
	// .map((v) => +v)
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	let invalidIdSum = 0
	for (const [min, max] of parsed) {
		for (let i = min; i <= max; i++) {
			const id = i.toString()
			if (id.length % 2 > 0) continue
			let digits = Math.floor(id.length / 2)
			const a = id.substring(0, digits)
			const b = id.substring(digits)
			if (a === b) {
				invalidIdSum += i
			}
		}
	}
	return invalidIdSum
}

export const part1Examples: Example[] = [
	[
		`11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
		'1227775554',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	let invalidIdSum = 0
	for (const [min, max] of parsed) {
		for (let id = min; id <= max; id++) {
			if (id < 10) continue
			const idString = id.toString()
			const maxDigits = Math.floor(idString.length / 2)
			let digits = 1
			do {
				if (idString.length / digits === Math.floor(idString.length / digits)) {
					const partial = idString.substring(0, digits)
					const times = idString.length / digits
					const repeated = partial.repeat(times)
					if (idString === repeated) {
						invalidIdSum += id
						break
					}
				}
				digits++
			} while (digits <= maxDigits)
		}
	}
	return invalidIdSum
}

export const part2Examples: Example[] = [[part1Examples[0][0], '4174379265']]
