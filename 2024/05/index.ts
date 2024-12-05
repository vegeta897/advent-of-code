const parseInput = (input: string) => {
	const [rulesText, updatesText] = input.trim().split('\n\n')
	const rules = rulesText.split('\n').map((rule) => rule.split('|').map((v) => +v))
	const updates = updatesText
		.split('\n')
		.map((update) => update.split(',').map((v) => +v))
	return [rules, updates]
}

const sortByRules = (arr: number[], rules: number[][]) =>
	arr.sort((a, b) => {
		const followedRule = rules.find(([x, y]) => x === a && y === b)
		const violatedRule = rules.find(([x, y]) => y === a && x === b)
		if (!violatedRule) return -1
		if (!followedRule) return 0
		return 1
	})

export const getPart1Answer: Answer = (input, example = false) => {
	const [rules, updates] = parseInput(input)
	let valid = 0
	for (const update of updates) {
		const preSortString = update.join(',')
		sortByRules(update, rules)
		const postSortString = update.join(',')
		if (preSortString === postSortString) {
			valid += update[Math.floor(update.length / 2)]
		}
	}
	return valid
}

export const part1Examples: Example[] = [
	[
		`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
		'143',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const [rules, updates] = parseInput(input)
	let invalid = 0
	for (const update of updates) {
		const preSortString = update.join(',')
		sortByRules(update, rules)
		const postSortString = update.join(',')
		if (preSortString !== postSortString) {
			invalid += update[Math.floor(update.length / 2)]
		}
	}
	return invalid
}

export const part2Examples: Example[] = [[part1Examples[0][0], '123']]
