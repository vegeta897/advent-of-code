const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((l) => l.split('').map((v) => +v))
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const parsed = parseInput(input)
	let sum = 0
	for (const bank of parsed) {
		let joltage = 0
		for (let i = 0; i < bank.length - 1; i++) {
			const tens = bank[i] * 10
			for (let o = i + 1; o < bank.length; o++) {
				const ones = bank[o]
				const number = tens + ones
				if (number > joltage) joltage = number
			}
		}
		sum += joltage
	}
	return sum
}

export const part1Examples: Example[] = [
	[
		`987654321111111
811111111111119
234234234234278
818181911112111`,
		'357',
	],
]

const cache: number[] = []

function getJoltage(bank: number[], fromIndex = 0, digit = 0) {
	const cacheIndex = (fromIndex << 4) + digit
	const cached = cache[cacheIndex]
	if (cached !== undefined) {
		return cached
	}
	let highestNumber = 0
	for (let i = fromIndex; i < bank.length - (11 - digit); i++) {
		const thisDigit = bank[i]
		if (digit === 11) {
			if (thisDigit > highestNumber) highestNumber = thisDigit
		} else {
			const number = thisDigit * 10 ** (11 - digit) + getJoltage(bank, i + 1, digit + 1)
			if (number > highestNumber) highestNumber = number
		}
	}
	const result = highestNumber
	cache[cacheIndex] = result
	return result
}

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	let sum = 0
	for (const bank of parsed) {
		const joltage = getJoltage(bank)
		// console.log(bank.join(''), joltage)
		sum += joltage
		cache.length = 0
	}
	return sum
}

export const part2Examples: Example[] = [[part1Examples[0][0], '3121910778619']]
