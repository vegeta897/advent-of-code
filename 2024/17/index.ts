const parseInput = (input: string) => {
	const [registersString, programString] = input.trim().split('\n\n')
	const registers: Registers = { A: 0, B: 0, C: 0 }
	registersString
		.split('\n')
		.forEach((line, l) => (registers['ABC'[l] as keyof Registers] = +line.split(': ')[1]))
	const program = programString
		.split(': ')[1]
		.split(',')
		.map((v) => +v)
	return { registers, program }
}

type Registers = { A: number; B: number; C: number }

const getComboOperand = (registers: Registers, operand: number) => {
	if (operand <= 3) return operand
	if (operand === 4) return registers.A
	if (operand === 5) return registers.B
	if (operand === 6) return registers.C
	throw 'invalid combo operand'
}

const runProgram = (registers: Registers, program: number[]) => {
	let pointer = 0
	const output: number[] = []
	let invalidProgram = false
	while (pointer < program.length) {
		const instruction = program[pointer]
		const operand = program[pointer + 1]
		let jump = false
		switch (instruction) {
			case 0:
				registers.A = Math.floor(registers.A / 2 ** getComboOperand(registers, operand))
				break
			case 1:
				registers.B = (registers.B ^ operand) >>> 0
				break
			case 2:
				registers.B = getComboOperand(registers, operand) % 8
				break
			case 3:
				if (registers.A > 0) {
					pointer = operand
					jump = true
				}
				break
			case 4:
				registers.B = (registers.B ^ registers.C) >>> 0
				break
			case 5:
				const digit = getComboOperand(registers, operand) % 8
				output.push(digit)
				break
			case 6:
				registers.B = Math.floor(registers.A / 2 ** getComboOperand(registers, operand))
				break
			case 7:
				registers.C = Math.floor(registers.A / 2 ** getComboOperand(registers, operand))
				break
			default:
				throw `invalid instruction "${instruction}"`
		}
		if (invalidProgram) break
		if (!jump) pointer += 2
	}
	return output
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { registers, program } = parseInput(input)
	const output = runProgram(registers, program)
	return output.join(',')
}

export const part1Examples: Example[] = [
	[
		`Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
		'4,6,3,5,6,3,5,2,1,0',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const { program } = parseInput(input)
	const candidates: number[][] = [[0]]
	for (let d = 0; d < program.length; d++) {
		const nextCandidates: number[] = []
		candidates.push(nextCandidates)
		for (const candidate of candidates[d]) {
			for (let i = 0; i < 8; i++) {
				const a = candidate * 8 + i
				const output = runProgram({ A: a, B: 0, C: 0 }, program)
				if (output.at(-(d + 1)) === program.at(-(d + 1))) {
					nextCandidates.push(a)
				}
			}
		}
	}
	const lowestA = candidates.at(-1)![0]
	return lowestA
}

export const part2Examples: Example[] = [
	[
		`Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
		'117440',
	],
]
