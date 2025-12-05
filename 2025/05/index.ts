const parseInput = (input: string) => {
	const [freshBlock, availableBlock] = input.trim().split('\n\n')
	const fresh = freshBlock.split('\n').map((line) => line.split('-').map((v) => +v)) as [
		number,
		number,
	][]
	const available = availableBlock.split('\n').map((v) => +v)
	return { fresh, available }
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const { fresh, available } = parseInput(input)
	let freshCount = 0
	for (const a of available) {
		for (const [min, max] of fresh) {
			if (a >= min && a <= max) {
				freshCount++
				break
			}
		}
	}
	return freshCount
}

export const part1Examples: Example[] = [
	[
		`3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
		'3',
	],
]

function reduceRanges(ranges: [number, number][]) {
	const reducedRanges: [min: number, max: number][] = []
	for (const [min, max] of ranges) {
		let modified = false
		for (let i = 0; i < reducedRanges.length; i++) {
			const [fMin, fMax] = reducedRanges[i]
			if (fMax < min || fMin > max) continue // No intersection
			if ((fMax >= min && fMin <= min) || (fMin <= max && fMax >= max)) {
				reducedRanges[i][0] = Math.min(fMin, min)
				reducedRanges[i][1] = Math.max(fMax, max)
				modified = true
			} else if (min <= fMin && max >= fMax) {
				reducedRanges[i][0] = min
				reducedRanges[i][1] = max
				modified = true
			} else if (fMax < max && fMin > min) {
				modified = true
			}
		}
		if (!modified) {
			reducedRanges.push([min, max])
		}
	}
	return reducedRanges
}

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const { fresh } = parseInput(input)
	let reducedRanges = fresh
	let originalSize = 0
	do {
		originalSize = reducedRanges.length
		reducedRanges = reduceRanges(reducedRanges)
	} while (reducedRanges.length < originalSize)
	let total = 0
	for (const [min, max] of reducedRanges) {
		total += max - min + 1
	}
	return total
}

export const part2Examples: Example[] = [
	[part1Examples[0][0], '14'],
	[
		`2-8
1-5
2-3
1-5
6-7
5-7
9-10
10-11

1`,
		'11',
	],
]
