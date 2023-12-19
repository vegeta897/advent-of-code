const parseInput = (input: string) => {
	const [workflowLines, partRatings] = input.trim().split('\n\n')
	const workflows = new Map(
		workflowLines.split('\n').map((workflowLine) => {
			const [name, rulesString] = workflowLine.slice(0, -1).split('{')
			return [
				name,
				rulesString.split(',').map((ruleString): Rule => {
					if (ruleString.includes(':')) {
						const [rule, dest] = ruleString.split(':')
						const ltOrGt = rule.includes('<') ? '<' : '>'
						const [prop, value] = rule.split(ltOrGt)
						return { dest, prop: prop as PartProp, ltOrGt, value: +value }
					} else {
						return { dest: ruleString }
					}
				}),
			]
		})
	)
	const parts = partRatings
		.split('\n')
		.map((partLine) =>
			JSON.parse(
				partLine
					.replaceAll('=', ':')
					.replace('x', '"x"')
					.replace('m', '"m"')
					.replace('a', '"a"')
					.replace('s', '"s"')
			)
		)
	return { workflows, parts }
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { workflows, parts } = parseInput(input)
	let total = 0
	for (const part of parts) {
		let workflowName = 'in'
		while (workflowName !== 'A' && workflowName !== 'R') {
			const rules = workflows.get(workflowName)!
			for (const rule of rules) {
				if ('prop' in rule) {
					const propValue: number = part[rule.prop!]
					if (
						(rule.ltOrGt === '>' && propValue > rule.value) ||
						(rule.ltOrGt === '<' && propValue < rule.value!)
					) {
						workflowName = rule.dest
						break
					}
				} else {
					workflowName = rule.dest
					break
				}
			}
			if (workflowName === 'A') {
				total += part.x + part.m + part.a + part.s
			}
		}
	}
	return total
}

export const part1Examples: Example[] = [
	[
		`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`,
		'19114',
	],
]

type PartProp = 'x' | 'm' | 'a' | 's'
type Condition = { prop: PartProp; ltOrGt: '<' | '>'; value: number }
type Rule = { dest: string } & ({} | Condition)
type MaybeNotCondition = Condition & { not?: boolean }
type Range = [min: number, max: number]

function generateAcceptPaths(
	workflows: Map<string, Rule[]>,
	workflowName = 'in',
	pathRules: MaybeNotCondition[] = [],
	acceptPaths: MaybeNotCondition[][] = []
) {
	if (workflowName === 'A' || workflowName === 'R') {
		if (workflowName === 'A') acceptPaths.push(pathRules)
		return acceptPaths
	}
	const rules = workflows.get(workflowName)!
	const thisPathRules = [...pathRules]
	for (const rule of rules) {
		if ('prop' in rule) {
			const condition: Condition = {
				ltOrGt: rule.ltOrGt,
				value: rule.value,
				prop: rule.prop,
			}
			generateAcceptPaths(
				workflows,
				rule.dest,
				[...thisPathRules, condition],
				acceptPaths
			)
			const notCondition = { not: true, ...condition }
			thisPathRules.push(notCondition)
		} else {
			generateAcceptPaths(workflows, rule.dest, [...thisPathRules], acceptPaths)
		}
	}
	return acceptPaths
}

const intsInRange = ([min, max]: Range) => max - min + 1

export const getPart2Answer: Answer = (input: string): string | number => {
	const { workflows } = parseInput(input)
	const acceptPaths = generateAcceptPaths(workflows)
	let possibilities = 0
	for (const acceptPath of acceptPaths) {
		const part: Record<PartProp, Range> = {
			x: [1, 4000],
			m: [1, 4000],
			a: [1, 4000],
			s: [1, 4000],
		}
		for (const { ltOrGt, not, prop, value } of acceptPath) {
			if (ltOrGt === '>') {
				if (not) {
					// not greater than, lower the maximum
					part[prop][1] = Math.min(value, part[prop][1])
				} else {
					// is greater than, raise the minimum
					part[prop][0] = Math.max(value + 1, part[prop][0])
				}
			} else {
				if (not) {
					// not less than, raise the minimum
					part[prop][0] = Math.max(value, part[prop][0])
				} else {
					// is less than, lower the maximum
					part[prop][1] = Math.min(value - 1, part[prop][1])
				}
			}
		}
		possibilities +=
			intsInRange(part.x) *
			intsInRange(part.m) *
			intsInRange(part.a) *
			intsInRange(part.s)
	}
	return possibilities
}

export const part2Examples: Example[] = [[part1Examples[0][0], '167409079868000']]
