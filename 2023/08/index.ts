const parseInput = (input: string) => {
	const [dirsLine, nodeLines] = input.trim().split('\n\n')
	const dirs = dirsLine.split('').map((d) => ['L', 'R'].indexOf(d))
	const nodes = Object.fromEntries(
		nodeLines.split('\n').map((nodeLine) => {
			const node = nodeLine.slice(0, 3)
			const left = nodeLine.slice(7, 10)
			const right = nodeLine.slice(12, 15)
			return [node, [left, right]]
		})
	)
	return { dirs, nodes }
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { dirs, nodes } = parseInput(input)
	let currentNode = 'AAA'
	let steps = 0
	while (currentNode !== 'ZZZ') {
		const nextNode = nodes[currentNode][dirs[steps % dirs.length]]
		currentNode = nextNode
		steps++
	}
	return steps
}

export const part1Examples: Example[] = [
	[
		`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
		'6',
	],
	[
		`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
		'2',
	],
]

const greatestCommonDivisorOf2 = (a: number, b: number) => {
	while (b) {
		const bb = b
		b = a % b
		a = bb
	}
	return a
}

const leastCommonMultipleOf2 = (a: number, b: number) =>
	Math.abs(a * b) / greatestCommonDivisorOf2(a, b)

const leastCommonMultiple = (...array: number[]) =>
	array.reduce((a, c) => leastCommonMultipleOf2(a, c), 1)

export const getPart2Answer: Answer = (input: string): string | number => {
	const { dirs, nodes } = parseInput(input)
	const dirsLength = dirs.length
	let steps = 0
	const ghostsOnNodes = Object.keys(nodes).filter((k) => k[2] === 'A')
	const ghostsLastZStep = ghostsOnNodes.map((_) => 0)
	const ghostPeriods = ghostsLastZStep.slice()
	while (true) {
		const nextStep = dirs[steps % dirsLength]
		for (let n = 0; n < ghostsOnNodes.length; n++) {
			ghostsOnNodes[n] = nodes[ghostsOnNodes[n]][nextStep]
			if (ghostsOnNodes[n][2] === 'Z') {
				if (ghostPeriods[n]) continue
				const lastZStep = ghostsLastZStep[n]
				if (lastZStep > 0) {
					ghostPeriods[n] = steps - lastZStep
					if (ghostPeriods.every((g) => g > 0)) {
						return leastCommonMultiple(...ghostPeriods)
					}
				} else {
					ghostsLastZStep[n] = steps
				}
			}
		}
		steps++
	}
}

export const part2Examples: Example[] = [
	[
		`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
		'6',
	],
]
