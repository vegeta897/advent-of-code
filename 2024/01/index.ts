const parseInput = (input: string) => {
	const lists: [number[], number[]] = [[], []]
	input
		.trim()
		.split('\n')
		.forEach((line) =>
			line.split('   ').forEach((id, i) => {
				lists[i].push(+id)
			})
		)
	return lists
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const [leftList, rightList] = parseInput(input)
	leftList.sort()
	rightList.sort()
	let sum = 0
	for (let i = 0; i < leftList.length; i++) {
		const leftID = leftList[i]
		const rightID = rightList[i]
		sum += Math.abs(leftID - rightID)
	}
	return sum
}

export const part1Examples: Example[] = [
	[
		`3   4
4   3
2   5
1   3
3   9
3   3`,
		'11',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const [leftList, rightList] = parseInput(input)
	let sum = 0
	for (let i = 0; i < leftList.length; i++) {
		const leftID = leftList[i]
		const instances = rightList.filter((rightID) => rightID === leftID)
		sum += leftID * instances.length
	}
	return sum
}

export const part2Examples: Example[] = [
	[
		`3   4
4   3
2   5
1   3
3   9
3   3`,
		'31',
	],
]
