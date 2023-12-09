const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map((line) => line.split(' ').map((v) => +v))

function reduceSequence(sequence: number[]) {
	const reduced: number[] = []
	for (let i = 1; i < sequence.length; i++) {
		reduced.push(sequence[i] - sequence[i - 1])
	}
	return reduced
}

function getReductions(sequence: number[]) {
	const reductions = [sequence]
	do {
		reductions.push(reduceSequence(reductions.at(-1)!))
	} while (reductions.at(-1)!.some((n) => n !== 0))
	return reductions
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const sequences = parseInput(input)
	let total = 0
	for (const sequence of sequences) {
		const reductions = getReductions(sequence)
		let lastValue = 0
		for (let i = reductions.length - 2; i >= 0; i--) {
			lastValue += reductions[i].at(-1)!
		}
		total += lastValue
	}
	return total
}

export const part1Examples: Example[] = [
	[
		`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
		'114',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const sequences = parseInput(input)
	let total = 0
	for (const sequence of sequences) {
		const reductions = getReductions(sequence)
		let firstValue = 0
		for (let i = reductions.length - 2; i >= 0; i--) {
			firstValue = reductions[i][0] - firstValue
		}
		total += firstValue
	}
	return total
}

export const part2Examples: Example[] = [[part1Examples[0][0], '2']]
