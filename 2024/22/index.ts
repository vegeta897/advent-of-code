const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map((v) => +v)

const mix = (input: number, secret: number): number => (input ^ secret) >>> 0
const prune = (secret: number): number => secret % 16777216

const getNextSecret = (input: number): number => {
	const stepOne = prune(mix(input * 64, input))
	const stepTwo = prune(mix(stepOne / 32, stepOne))
	const stepThree = prune(mix(stepTwo * 2048, stepTwo))
	return stepThree
}

export const getPart1Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let sum = 0
	for (const secret of parsed) {
		let result = secret
		for (let i = 0; i < 2000; i++) {
			result = getNextSecret(result)
		}
		sum += result
	}
	return sum
}

export const part1Examples: Example[] = [
	[
		`1
10
100
2024`,
		'37327623',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	const summedSequencePriceMap: Map<string, number> = new Map()
	let bestSum = 0
	for (const secret of parsed) {
		const diffList: number[] = []
		const thisListSequences: Set<string> = new Set()
		let result = secret
		for (let i = 0; i < 2000; i++) {
			const nextSecret = getNextSecret(result)
			const price = nextSecret % 10
			const diff = price - (result % 10)
			if (price > 0 && i >= 3) {
				const sequenceKey = `${diffList.at(-3)!},${diffList.at(-2)!},${diffList.at(-1)!},${diff}`
				if (!thisListSequences.has(sequenceKey)) {
					thisListSequences.add(sequenceKey)
					const existingSum = summedSequencePriceMap.get(sequenceKey) || 0
					const newSum = existingSum + price
					if (newSum > bestSum) bestSum = newSum
					summedSequencePriceMap.set(sequenceKey, newSum)
				}
			}
			diffList.push(diff)
			result = nextSecret
		}
	}
	return bestSum
}

export const part2Examples: Example[] = [
	[
		`1
2
3
2024`,
		'23',
	],
]
