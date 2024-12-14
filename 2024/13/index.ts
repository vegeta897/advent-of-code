import { diffXY, divideXY, scaleXY, XY } from '../util'

const parseInput = (input: string, part2 = false) => {
	return input
		.trim()
		.split('\n\n')
		.map((machineString) => {
			const [btnAstr, btnBstr, prizeStr] = machineString.split('\n')
			const aXY = btnAstr
				.split(': ')[1]
				.split(', ')
				.map((v) => +v.split('+')[1]) as XY
			const bXY = btnBstr
				.split(': ')[1]
				.split(', ')
				.map((v) => +v.split('+')[1]) as XY
			const prizeXY = prizeStr
				.split(': ')[1]
				.split(', ')
				.map((v) => +v.split('=')[1] + (part2 ? 10000000000000 : 0)) as XY
			return { aXY, bXY, prizeXY }
		})
}

const calcTokens = (a: number, b: number) => a * 3 + b

export const getPart1Answer: Answer = (input, example = false) => {
	const MAX_BTN = 100
	const parsed = parseInput(input)
	let totalTokens = 0
	for (const { aXY, bXY, prizeXY } of parsed) {
		for (let a = 0; a <= MAX_BTN; a++) {
			const aDistance = scaleXY(aXY, a)
			const remaining = diffXY(prizeXY, aDistance)
			const bNeeded = divideXY(remaining, bXY)
			if (
				bNeeded[0] !== Math.floor(bNeeded[0]) ||
				bNeeded[1] !== Math.floor(bNeeded[1]) ||
				bNeeded[0] !== bNeeded[1]
			) {
				continue
			}
			totalTokens += calcTokens(a, bNeeded[0])
			break
		}
	}
	return totalTokens
}

export const part1Examples: Example[] = [
	[
		`Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
		'480',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input, true)
	let totalTokens = 0
	for (const { aXY, bXY, prizeXY } of parsed) {
		const bRatio = bXY[0] / bXY[1]
		let a = 1
		let attempts = 0
		let lastMissRatio: number | null = null
		let factor = 10000000000
		while (attempts++ < 1000) {
			const distance = scaleXY(aXY, a)
			const missedBy = diffXY(prizeXY, distance)
			const missRatio = missedBy[0] / missedBy[1] - bRatio
			if (missRatio === 0) {
				const b = missedBy[0] / bXY[0]
				if (b !== Math.round(b)) continue
				totalTokens += calcTokens(a, b)
				break
			}
			if (lastMissRatio === null) {
				lastMissRatio = missRatio
				continue
			}
			if (Math.abs(missRatio) > Math.abs(lastMissRatio)) {
				if (Math.abs(factor) > 1) factor /= -10
				else factor *= -1
			}
			lastMissRatio = missRatio
			a += factor
		}
	}
	return totalTokens
}

export const part2Examples: Example[] = []
