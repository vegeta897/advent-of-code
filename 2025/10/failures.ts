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

const cache: Map<string, number> = new Map()
let lowestPresses = Infinity

function tryButtonPresses(
	// targetJoltages: number[],
	// currentJoltages: number[],
	buttons: number[][],
	lastJoltageButtons: number[],
	// buttonRelations: number[][],
	buttonIndex: number,
	remainingPressesByJoltage: number[],
	remainingPressesByButton: number[],
	// pressesPerButton: number[],
	totalPresses: number
): false | number {
	if (buttonIndex === buttons.length) {
		if (remainingPressesByJoltage.every((r) => r === 0)) {
			if (totalPresses < lowestPresses) {
				lowestPresses = totalPresses
				console.log(totalPresses)
			}
			return totalPresses
		}
		return false
	}
	// const cacheKey = currentJoltages.join() + '-' + tryButton
	// const cached = cache.get(cacheKey)
	// if (cached) {
	// 	console.log('cache hit!')
	// 	return cached
	// }
	const button = buttons[buttonIndex]
	let maxPresses = Math.max(0, remainingPressesByButton[buttonIndex])
	for (const jIndex of button) {
		const remainingPresses = remainingPressesByJoltage[jIndex]
		if (remainingPresses < maxPresses) maxPresses = remainingPresses
	}
	let bestResult: boolean | number = false
	for (let p = maxPresses; p >= 0; p--) {
		if (totalPresses + p > lowestPresses) continue
		// console.log(buttons[tryButton], 'x', p, remainingButtonsPerJoltage)
		// const nextJoltages = [...currentJoltages]
		const nextRemainingPressesByJoltage = [...remainingPressesByJoltage]
		const nextRemainingPressesByButton = [...remainingPressesByButton]
		// let requiredPresses = 0
		for (const jIndex of button) {
			// if (nextJoltages[jIndex] + p > targetJoltages[jIndex]) {
			// 	return false
			// }
			// nextJoltages[jIndex] += p
			nextRemainingPressesByJoltage[jIndex] -= p
			if (p < maxPresses && lastJoltageButtons[jIndex] === buttonIndex) {
				return false
			}

			// const offTarget = targetJoltages[jIndex] - currentJoltages[jIndex]
			// if (offTarget > 0 && lastJoltageButtons[jIndex] === buttonIndex) {
			// 	// console.log('out of buttons')
			// 	if (requiredPresses && requiredPresses !== offTarget) {
			// 		return false
			// 	}
			// 	if (offTarget > maxPresses) return false
			// 	requiredPresses = offTarget
			// }
		}
		// for (let b = buttonIndex + 1; b < buttons.length; b++) {
		// 		nextRemainingPressesByButton[b] = p
		// 	// if (nextRemainingPressesByButton[b] < 0)
		// 	// 	console.log(b, nextRemainingPressesByButton[b])
		// }
		const presses = /*requiredPresses ||*/ p
		// const nextMaxPressesPerButton = [...maxPressesPerButton]
		// for (const relation of buttonRelations[buttonIndex]) {
		// 	nextMaxPressesPerButton[relation] -= presses
		// }
		if (buttonIndex <= 0) console.log(buttonIndex, presses, '/', maxPresses)
		const result = tryButtonPresses(
			// targetJoltages,
			// nextJoltages,
			buttons,
			lastJoltageButtons,
			// buttonRelations,
			buttonIndex + 1,
			nextRemainingPressesByJoltage,
			nextRemainingPressesByButton,
			// [...pressesPerButton, presses],
			totalPresses + presses
		)
		if (result && (!bestResult || result < bestResult)) bestResult = result
	}
	// if (bestResult) cache.set(cacheKey, bestResult)
	return bestResult
}

let minMaxes: [number, number][] = []

function findMinMaxPresses(
	targetJoltages: number[],
	currentJoltages: number[],
	maxJoltage: number,
	buttons: number[][],
	buttonIndex: number,
	buttonPresses: number[]
) {
	if (buttonIndex === buttons.length) {
		for (let b = 0; b < buttonPresses.length; b++) {
			if (buttonPresses[b] < minMaxes[b][0]) minMaxes[b][0] = buttonPresses[b]
			if (buttonPresses[b] > minMaxes[b][1]) minMaxes[b][1] = buttonPresses[b]
		}
		return
	}
	const button = buttons[buttonIndex]
	for (let p = 0; p <= maxJoltage; p++) {
		const nextJoltages = [...currentJoltages]
		for (const jIndex of button) {
			if (nextJoltages[jIndex] + p > targetJoltages[jIndex]) {
				return
			}
			nextJoltages[jIndex] += p
		}
		findMinMaxPresses(
			targetJoltages,
			nextJoltages,
			maxJoltage,
			buttons,
			buttonIndex + 1,
			[...buttonPresses, p]
		)
	}
}

function findAllPressCombos(
	targetJoltages: number[],
	currentJoltages: number[],
	maxPressesPerButton: number[],
	totalMaxPresses: number,
	buttons: number[][],
	buttonIndex = 0,
	buttonPresses: number[] = [],
	totalPresses = 0
) {
	if (buttonIndex === buttons.length) {
		for (let b = 0; b < buttonPresses.length; b++) {
			if (buttonPresses[b] < minMaxes[b][0]) minMaxes[b][0] = buttonPresses[b]
			if (buttonPresses[b] > minMaxes[b][1]) minMaxes[b][1] = buttonPresses[b]
		}
		return
	}
	const button = buttons[buttonIndex]
	const remainingPresses = Math.min(
		totalMaxPresses - totalPresses,
		maxPressesPerButton[buttonIndex]
	)
	const minPresses =
		buttonIndex === buttons.length - 1 ? totalMaxPresses - totalPresses : 0
	for (let p = minPresses; p <= remainingPresses; p++) {
		const nextJoltages = [...currentJoltages]
		for (const jIndex of button) {
			if (nextJoltages[jIndex] + p > targetJoltages[jIndex]) {
				return
			}
			nextJoltages[jIndex] += p
		}
		findAllPressCombos(
			targetJoltages,
			nextJoltages,
			maxPressesPerButton,
			totalMaxPresses,
			buttons,
			buttonIndex + 1,
			[...buttonPresses, p],
			totalPresses + p
		)
	}
}

const getButtonBinary = (button: number[]) => button.reduce((p, c) => p + (1 << c))

export const getPart2AnswerOld: Answer = (input, example = false) => {
	// if (!example) return 0
	const machines = parseInput(input)
	const startingMachine = example ? 0 : 46
	let totalPresses = example ? 0 : 4131
	for (let m = startingMachine; m < machines.length; m++) {
		const machine = machines[m]
		machine.buttons.sort((a, b) => b.length - a.length)
		// machine.buttons.reverse()
		console.time(`machine ${m}`)
		console.log('machine', m, `: ${machine.joltages.join(' ')} `.padEnd(50, '='))

		const maxPressesPerButton = machine.buttons.map((button) => {
			let lowestJoltage = Infinity
			for (const j of button) {
				if (machine.joltages[j] < lowestJoltage) lowestJoltage = machine.joltages[j]
			}
			return lowestJoltage
		})
		// const maxPresses = maxPressesPerButton.reduce((p, c) => p + c)
		// console.log('max presses', maxPressesPerButton, maxPresses)
		const joltagesWithAllMaxPresses = machine.joltages.map((_, j) => {
			let joltage = 0
			for (let b = 0; b < maxPressesPerButton.length; b++) {
				if (machine.buttons[b].includes(j)) joltage += maxPressesPerButton[b]
			}
			return joltage
		})
		// console.log(joltagesWithAllMaxPresses)
		const minPressesPerButton = machine.buttons.map((button, b) => {
			const reducedJoltages = joltagesWithAllMaxPresses.map((joltage, j) =>
				button.includes(j) ? joltage - maxPressesPerButton[b] : joltage
			)
			let minPresses = 0
			for (let j = 0; j < machine.joltages.length; j++) {
				const shortBy = machine.joltages[j] - reducedJoltages[j]
				if (shortBy > minPresses) minPresses = shortBy
			}
			return minPresses
		})
		const startingJoltages = machine.joltages.map(() => 0)
		for (let b = 0; b < minPressesPerButton.length; b++) {
			const presses = minPressesPerButton[b]
			if (presses > 0) {
				for (const j of machine.buttons[b]) {
					startingJoltages[j] += presses
				}
			}
		}
		// console.log('start joltage', startingJoltages)
		// const newMaxPressesPerButton = machine.buttons.map((button, b) => {
		// 	let lowestJoltage = Infinity
		// 	for (const b of button) {
		// 		const joltage = machine.joltages[b] - startingJoltages[b]
		// 		if (joltage < lowestJoltage) lowestJoltage = joltage
		// 	}
		// 	return minPressesPerButton[b] + lowestJoltage
		// })
		// const newMaxPresses = newMaxPressesPerButton.reduce((p, c) => p + c)
		// console.log('nmx presses 1', newMaxPressesPerButton.join(' '), newMaxPresses)
		const buttonsByJoltage: [number, number[]][] = machine.joltages.map((_, j) => [
			j,
			machine.buttons
				.filter((button) => button.includes(j))
				.map((button) => machine.buttons.indexOf(button)),
		])
		const buttonsPerJoltage = buttonsByJoltage.map((b) => b[1].length)
		// console.log('buttons per joltage', buttonsPerJoltage)
		const bpj = [...buttonsPerJoltage]
		const lastJoltageButtons: number[] = []
		for (let b = 0; b < machine.buttons.length; b++) {
			for (const j of machine.buttons[b]) {
				bpj[j]--
				if (bpj[j] === 0) {
					lastJoltageButtons[j] = b
				}
			}
		}
		// buttonsByJoltage.sort((a, b) => a[1].length - b[1].length)
		console.log(buttonsByJoltage.map(([j, b]) => `${j}: ${b.join(' ')}`).join('\n'))
		// for (const [j, buttonIndexes] of buttonsByJoltage) {
		// 	const totalMaxPresses = machine.joltages[j]
		// 	// console.log(j, 'joltage vs max presses', joltage, maxPresses)
		// 	minMaxes = buttonIndexes.map(() => [Infinity, -1])
		// 	const buttons = buttonIndexes.map((b) => machine.buttons[b])
		// 	findAllPressCombos(
		// 		machine.joltages,
		// 		machine.joltages.map(() => 0),
		// 		buttonIndexes.map((bi) => newMaxPressesPerButton[bi]),
		// 		totalMaxPresses,
		// 		buttons
		// 	)
		// 	buttonIndexes.forEach((bi, b) => {
		// 		// console.log(
		// 		// 	'button index',
		// 		// 	bi,
		// 		// 	'updated max presses',
		// 		// 	newMaxPressesPerButton[bi],
		// 		// 	minMaxes[b][1]
		// 		// )
		// 		newMaxPressesPerButton[bi] = Math.min(newMaxPressesPerButton[bi], minMaxes[b][1])
		// 		minPressesPerButton[bi] = Math.max(minPressesPerButton[bi], minMaxes[b][0])
		// 	})
		// 	console.log(minMaxes)
		// 	// break
		// }
		// const newMinPressesPerButton = machine.buttons.map((button, b) => {
		// 	const reducedJoltages = joltagesWithAllMaxPresses.map((joltage, j) =>
		// 		button.includes(j) ? joltage - newMaxPressesPerButton[b] : joltage
		// 	)
		// 	let minPresses = 0
		// 	for (let j = 0; j < machine.joltages.length; j++) {
		// 		const shortBy = machine.joltages[j] - reducedJoltages[j]
		// 		if (shortBy > minPresses) minPresses = shortBy
		// 	}
		// 	return minPresses
		// })
		const remainingPressesByJoltage = buttonsByJoltage.map(
			([j, button]) => machine.joltages[j] /*({
			joltage: machine.joltages[j],
			remainingPresses: machine.joltages[j],
			buttonCode: getButtonBinary(button),
		})*/
		)
		console.log(remainingPressesByJoltage)

		// console.log('nmx presses 2', newMaxPressesPerButton.join(' '), newMaxPresses)
		// const minPresses = newMinPressesPerButton.reduce((p, c) => p + c)
		// console.log('new min presses', newMinPressesPerButton, minPresses)
		// console.log('last joltage buttons', lastJoltageButtons)
		// const buttonRelations = machine.buttons.map((button, b) =>
		// 	machine.buttons
		// 		.map((jIndexes, b) => ({
		// 			index: b,
		// 			maxPresses: newMaxPressesPerButton[b],
		// 			jIndexes,
		// 		}))
		// 		.filter((ob) => ob !== b && machine.buttons[ob].some((j) => button.includes(j)))
		// )
		// console.log('button relations', buttonRelations)
		const remainingPressesByButton = maxPressesPerButton
		lowestPresses = Infinity
		const presses = tryButtonPresses(
			// machine.joltages,
			// machine.joltages.map(() => 0),
			machine.buttons,
			lastJoltageButtons,
			0,
			remainingPressesByJoltage,
			remainingPressesByButton,
			// [],
			0
		)
		if (lowestPresses === Infinity) throw 'no valid press count found!'
		totalPresses += lowestPresses
		console.log('machine', m, 'finished!', lowestPresses, totalPresses)
		console.timeEnd(`machine ${m}`)
		// break
		// cache.clear()
	}
	// not 166
	return totalPresses
}
