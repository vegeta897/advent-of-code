const parseInput = (input: string) => {
	const [towelsStr, designsStr] = input.trim().split('\n\n')
	const towels = towelsStr.split(', ')
	const designs = designsStr.split('\n')
	return { towels, designs }
}

const possibleCache: Map<string, boolean> = new Map()

const canDesign = (design: string, remaining: string, towels: string[]): boolean => {
	const cached = possibleCache.get(remaining)
	if (cached !== undefined) return cached
	for (const towel of towels) {
		if (towel.length > remaining.length) continue
		if (towel === remaining) {
			possibleCache.set(remaining, true)
			return true
		}
		if (towel === remaining.substring(0, towel.length)) {
			const nowRemaining = remaining.substring(towel.length)
			const complete = canDesign(design, nowRemaining, towels)

			if (complete) {
				possibleCache.set(remaining, complete)
				return complete
			}
		}
	}
	possibleCache.set(remaining, false)
	return false
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { towels, designs } = parseInput(input)
	possibleCache.clear()
	let validDesigns = 0
	for (const design of designs) {
		const validDesign = canDesign(design, design, towels)
		if (validDesign) validDesigns++
	}
	return validDesigns
}

export const part1Examples: Example[] = [
	[
		`r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
		'6',
	],
]

const countCache: Map<string, number> = new Map()

const getDesignCount = (design: string, remaining: string, towels: string[]): number => {
	const cachedCount = countCache.get(remaining)
	if (cachedCount !== undefined) return cachedCount
	let count = 0
	for (const towel of towels) {
		if (towel.length > remaining.length) continue
		if (towel === remaining) {
			count++
			continue
		}
		if (towel === remaining.substring(0, towel.length)) {
			const newRemaining = remaining.substring(towel.length)
			const newWays = getDesignCount(design, newRemaining, towels)
			count += newWays
		}
	}
	countCache.set(remaining, count)
	return count
}

export const getPart2Answer: Answer = (input, example = false) => {
	const { towels, designs } = parseInput(input)
	countCache.clear()
	let totalCount = 0
	for (const design of designs) {
		const count = getDesignCount(design, design, towels)
		totalCount += count
	}
	return totalCount
}

export const part2Examples: Example[] = [[part1Examples[0][0], '16']]
