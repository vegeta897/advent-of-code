const parseInput = (input: string): [number, number[]][] => {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			const [resultS, factorsS] = line.split(': ')
			return [+resultS, factorsS.split(' ').map((v) => +v)]
		})

	// .map((v) => +v)
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	let total = 0
	for (const [result, factors] of parsed) {
		for (let i = 0; i < 1 << (factors.length - 1); i++) {
			let thisResult = factors[0]
			for (let f = 1; f < factors.length; f++) {
				const factor = factors[f]
				const bit = i & (1 << (f - 1))
				if (bit === 0) {
					thisResult += factor
				} else {
					thisResult *= factor
				}
			}
			if (thisResult === result) {
				total += result
				break
			}
		}
	}
	return total
}

export const part1Examples: Example[] = [
	[
		`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
		'3749',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	let total = 0
	for (const [result, factors] of parsed) {
		for (let i = 0; i < (1 << (factors.length - 1)) << (factors.length - 1); i++) {
			let thisResult = factors[0]
			for (let f = 1; f < factors.length; f++) {
				const factor = factors[f]
				const concBit = i & ((1 << (f - 1)) << (factors.length - 1))
				if (concBit !== 0) {
					thisResult = +`${thisResult}${factor}`
				} else {
					const multAddBit = i & (1 << (f - 1))
					if (multAddBit === 0) {
						thisResult += factor
					} else {
						thisResult *= factor
					}
				}
			}
			if (thisResult === result) {
				total += result
				break
			}
		}
	}
	return total
}

export const part2Examples: Example[] = [[part1Examples[0][0], '11387']]
