const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((v) => +v)
}

const getCaloriesPerElf = (input: number[]) => {
	const calories = []
	let current = 0
	for (const line of input) {
		// Gaps will be 0
		if (line) {
			current += line
		} else {
			calories.push(current)
			current = 0
		}
	}
	if (current) calories.push(current)
	return calories
}

export const getPart1Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const calories = getCaloriesPerElf(parsed)
	return calories.sort((a, b) => b - a)[0].toString()
}

export const part1Examples = [
	[
		`
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
		'24000',
	],
]

export const getPart2Answer = (input: string): string | number => {
	return ''
}

export const part2Examples = [[``, '']]
