const parseInput = (input: string, p2 = false) => {
	const lines = input.split('\n')
	if (p2) return lines
	const lineFigures = lines.map((line) => line.split(/ +/g).filter((f) => f))
	return lineFigures
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const lineFigures = parseInput(input)
	let sum = 0
	for (let i = 0; i < lineFigures[0].length; i++) {
		const operands: number[] = []
		for (let n = 0; n < lineFigures.length - 1; n++) {
			operands.push(+lineFigures[n][i])
		}
		if (lineFigures.at(-1)![i] === '+') {
			sum += operands.reduce((p, c) => p + c)
		} else {
			sum += operands.reduce((p, c) => p * c)
		}
	}
	return sum
}

export const part1Examples: Example[] = [
	[
		`123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
		'4277556',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const lines = parseInput(input, true)
	let digits = lines.length - 1
	let sum = 0
	const operands: number[] = []
	for (let x = lines[0].length - 1; x >= 0; x--) {
		let operand = 0
		let digit = 0
		for (let d = digits - 1; d >= 0; d--) {
			const char = lines[d][x]
			if (char !== ' ') {
				operand += parseInt(char) * 10 ** digit
				digit++
			}
		}
		if (operand === 0) continue
		operands.push(operand)
		if (lines[digits][x] !== ' ') {
			if (lines[digits][x] === '+') {
				sum += operands.reduce((p, c) => p + c)
			} else if (lines[digits][x] === '*') {
				sum += operands.reduce((p, c) => p * c)
			}
			operands.length = 0
		}
	}
	return sum
}

export const part2Examples: Example[] = [[part1Examples[0][0], '3263827']]
