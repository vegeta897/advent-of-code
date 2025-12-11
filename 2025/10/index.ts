const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			const elements = line.split(' ')
			const lights = elements
				.shift()!
				.replaceAll(/[\[\]]/g, '')
				.split('')
			const joltages = elements
				.pop()!
				.replaceAll(/[\{\}]/g, '')
				.split(',')
				.map((v) => +v)
			const buttons = elements.map((element) =>
				element
					.replaceAll(/[\(\)]/g, '')
					.split(',')
					.map((v) => +v)
			)
			return { lights, joltages, buttons }
		})
}

const toggleLight = (light: string) => (light === '.' ? '#' : '.')

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const machines = parseInput(input)
	let totalPresses = 0
	for (const machine of machines) {
		let fewestPresses = Infinity
		const targetLights = machine.lights.join('')
		const maxCombinations = 1 << machine.buttons.length
		for (let i = 0; i < maxCombinations; i++) {
			let presses = 0
			let lights = machine.lights.map(() => '.')
			for (let b = 0; b < machine.buttons.length; b++) {
				const buttonBit = 1 << b
				if (i & buttonBit) {
					presses++
					for (const buttonLight of machine.buttons[b]) {
						lights[buttonLight] = toggleLight(lights[buttonLight])
					}
				}
			}
			if (lights.join('') === targetLights) {
				if (presses < fewestPresses) fewestPresses = presses
			}
		}
		totalPresses += fewestPresses
	}
	return totalPresses
}

export const part1Examples: Example[] = [
	[
		`[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
		'7',
	],
]

const buttonInMask = (mask: number, b: number) => (mask & (1 << b)) > 0

function getNextPermutation(permutation: number[]) {
	let subtractFrom = 0
	for (let i = permutation.length - 1; i > 0; i--) {
		if (permutation[i] !== 0) {
			subtractFrom = i
			break
		}
	}
	if (subtractFrom === 0) return false
	const previousValue = permutation[subtractFrom]
	permutation[subtractFrom - 1] += 1
	permutation[subtractFrom] = 0
	permutation[permutation.length - 1] = previousValue - 1
	return true
}

// Adapted from https://www.reddit.com/r/adventofcode/comments/1pity70/comment/ntb36sb/
function getMinimumPresses(joltages: number[], buttonMask: number, buttons: number[][]) {
	if (joltages.every((j) => j === 0)) return 0
	let targetJoltage = 0
	let fewestButtons = Infinity
	let targetButtons: number[] = []
	for (let j = 0; j < joltages.length; j++) {
		if (joltages[j] === 0) continue
		const joltageButtons = buttons
			.map((_, b) => b)
			.filter((b) => buttonInMask(buttonMask, b) && buttons[b].includes(j))
		if (
			joltageButtons.length < fewestButtons ||
			(joltageButtons.length === fewestButtons && joltages[j] > targetJoltage)
		) {
			fewestButtons = joltageButtons.length
			targetJoltage = joltages[j]
			targetButtons = joltageButtons
		}
	}
	let result = Infinity
	if (targetButtons.length > 0) {
		let newButtonMask = buttonMask
		for (const b of targetButtons) {
			newButtonMask -= 1 << b
		}
		const buttonsToPress = targetButtons.map(() => 0)
		buttonsToPress[buttonsToPress.length - 1] = targetJoltage
		while (true) {
			let valid = true
			const nextJoltages = [...joltages]
			for (let p = 0; p < buttonsToPress.length; p++) {
				const presses = buttonsToPress[p]
				if (presses === 0) continue
				for (const j of buttons[targetButtons[p]]) {
					if (nextJoltages[j] < presses) {
						valid = false
						break
					}
					nextJoltages[j] -= presses
				}
				if (!valid) break
			}
			if (valid) {
				const nextResult = getMinimumPresses(nextJoltages, newButtonMask, buttons)
				if (nextResult !== Infinity) {
					result = Math.min(result, targetJoltage + nextResult)
				}
			}
			const nextPermutation = getNextPermutation(buttonsToPress)
			if (!nextPermutation) break
		}
	}

	return result
}

export const getPart2Answer: Answer = (input, example = false) => {
	const machines = parseInput(input)
	let totalPresses = 0
	for (let m = 0; m < machines.length; m++) {
		const machine = machines[m]
		console.log('machine', m, `: ${machine.joltages.join(' ')} `.padEnd(50, '='))
		const presses = getMinimumPresses(
			machine.joltages,
			(1 << machine.buttons.length) - 1, // Mask containing all buttons
			machine.buttons
		)
		totalPresses += presses
		console.log(m, 'done', presses, '->', totalPresses)
	}
	return totalPresses
}

export const part2Examples: Example[] = [[part1Examples[0][0], '33']]
