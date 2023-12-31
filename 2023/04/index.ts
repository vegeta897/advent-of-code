const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map(
			(line) =>
				line
					.split(/: +/)[1] // Strip out "Card   1:"
					.split(' | ') // Split sets
					.map((ns) => ns.split(/ +/)) // Split numbers
		)

export const getPart1Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	let sum = 0
	for (const card of parsed) {
		const myWins = card[1].filter((n) => card[0].includes(n))
		if (myWins.length > 0) {
			sum += 1 << (myWins.length - 1)
		}
	}
	return sum
}

export const part1Examples: Example[] = [
	[
		`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
		13,
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const cards: [wins: number, count: number][] = parsed.map((c) => [
		c[1].filter((n) => c[0].includes(n)).length,
		1,
	])
	for (let w = 0; w < cards.length; w++) {
		const [wins, count] = cards[w]
		if (wins === 0) continue
		for (let e = 1; e <= wins; e++) {
			if (w + e > cards.length - 1) break
			cards[w + e][1] += count
		}
	}
	return cards.map(([, w]) => w).reduce((a, c) => a + c, 0)
}

export const part2Examples: Example[] = [[part1Examples[0][0], 30]]
