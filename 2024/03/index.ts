const parseInput = (input: string) => input.trim()

const getMultsSum = (multsString: string) => {
	const mults = multsString.split('mul(')
	let sum = 0
	for (let mult of mults) {
		const args = mult.split(')')[0]
		const operands = args.split(',')
		if (
			operands.some((operand) => operand.includes(' ') || !/^[0-9]{1,3}$/.test(operand))
		)
			continue
		const product = +operands[0] * +operands[1]
		sum += product
	}
	return sum
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const parsed = parseInput(input)
	return getMultsSum(parsed)
}

export const part1Examples: Example[] = [
	[`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`, '161'],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const parsed = parseInput(input)
	const doSplits = parsed.split('do()')
	const filteredDos: string[] = []
	for (let doSplit of doSplits) {
		const doDontSplit = doSplit.split("don't()")
		filteredDos.push(doDontSplit[0])
	}
	let sum = 0
	for (let filteredDo of filteredDos) {
		sum += getMultsSum(filteredDo)
	}
	return sum
}

export const part2Examples: Example[] = [
	[`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`, '48'],
]
