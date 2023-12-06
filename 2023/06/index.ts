const parseInput = (input: string) => {
	const [times, distances] = input
		.trim()
		.split('\n')
		.map((line) =>
			line
				.split(':')[1]
				.trim()
				.split(/ +/)
				.map((v) => +v)
		)
	return { times, distances }
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { times, distances } = parseInput(input)
	let product = 1
	for (let i = 0; i < times.length; i++) {
		let possibleWins = 0
		const raceTime = times[i]
		const distanceToBeat = distances[i]
		for (let w = 1; w < raceTime; w++) {
			const moveTime = raceTime - w
			if (moveTime * w > distanceToBeat) {
				possibleWins++
			}
		}
		product *= possibleWins
	}
	return product
}

export const part1Examples: Example[] = [
	[
		`Time:      7  15   30
Distance:  9  40  200`,
		'288',
	],
]

const parseInput2 = (input: string) => {
	const [time, distance] = input
		.trim()
		.split('\n')
		.map((l) => +l.split(':')[1].replaceAll(' ', ''))
	return { time, distance }
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const { time, distance } = parseInput2(input)
	let lowestWindupTime = 0
	for (let w = 1; w < time; w++) {
		const moveTime = time - w
		if (moveTime * w > distance) {
			lowestWindupTime = w
			break
		}
	}
	let highestWindupTime = 0
	for (let w = time - 1; w > 0; w--) {
		const moveTime = time - w
		if (moveTime * w > distance) {
			highestWindupTime = w
			break
		}
	}
	return highestWindupTime - lowestWindupTime + 1
}

export const part2Examples: Example[] = [[part1Examples[0][0], '71503']]
