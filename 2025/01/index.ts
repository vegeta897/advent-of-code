const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => [line[0], +line.slice(1)] as ['L' | 'R', number])
	// .map((v) => +v)
}

export const getPart1Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let dial = 50
	let count = 0
	for (let [dir, distance] of parsed) {
		const sign = dir === 'R' ? 1 : -1
		dial = (dial + distance * sign) % 100
		if (dial < 0) dial += 100
		if (dial === 0) count++
	}
	return count
}

export const part1Examples: Example[] = [
	[
		`L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
		'3',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let dial = 50
	let count = 0
	for (let [dir, distance] of parsed) {
		const sign = dir === 'R' ? 1 : -1
		if (sign === 1) {
			count += Math.floor((dial + distance) / 100)
		} else {
			if (distance >= dial) {
				if (dial > 0) count++
				const remainingDistance = distance - dial
				count += Math.floor(remainingDistance / 100)
			}
		}
		dial = (dial + distance * sign) % 100
		if (dial < 0) dial += 100
	}
	return count
}

export const part2Examples: Example[] = [[part1Examples[0][0], '6']]
