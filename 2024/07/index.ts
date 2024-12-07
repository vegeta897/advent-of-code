const parseInput = (input: string): [number, number[]][] => {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			const [testValueString, numbersString] = line.split(': ')
			return [+testValueString, numbersString.split(' ').map((v) => +v)]
		})
}

const solve = (
	testValue: number,
	currentValue: number,
	remainingNumbers: number[],
	allowConcat = false
) => {
	if (remainingNumbers.length === 0) return currentValue === testValue
	const nextNumber = remainingNumbers.shift()!
	const add = currentValue + nextNumber
	const added =
		add <= testValue && solve(testValue, add, [...remainingNumbers], allowConcat)
	if (added) return true
	const multiply = currentValue * nextNumber
	const multiplied =
		multiply <= testValue &&
		solve(testValue, multiply, [...remainingNumbers], allowConcat)
	if (multiplied) return true
	if (allowConcat) {
		const concat = currentValue * 10 ** nextNumber.toString().length + nextNumber
		const concated =
			concat <= testValue && solve(testValue, concat, [...remainingNumbers], true)
		if (concated) return true
	}
}

export const getPart1Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let total = 0
	for (const [testValue, numbers] of parsed) {
		if (solve(testValue, 0, numbers)) total += testValue
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
	const parsed = parseInput(input)
	let total = 0
	for (const [testValue, numbers] of parsed) {
		if (solve(testValue, 0, numbers, true)) total += testValue
	}
	return total
}

export const part2Examples: Example[] = [[part1Examples[0][0], '11387']]
