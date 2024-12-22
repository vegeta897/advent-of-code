import { diffXY, XY } from '../util'

const parseInput = (input: string): [sequence: NumButton[], value: number][] => {
	return input
		.trim()
		.split('\n')
		.map((line) => [line.split('') as NumButton[], +line.replace('A', '')])
}

type NumButton = 'A' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

const numericPadMap: Record<NumButton, XY> = {
	'A': [2, 3],
	'0': [1, 3],
	'1': [0, 2],
	'2': [1, 2],
	'3': [2, 2],
	'4': [0, 1],
	'5': [1, 1],
	'6': [2, 1],
	'7': [0, 0],
	'8': [1, 0],
	'9': [2, 0],
}

type ArrowButton = 'A' | 'v' | '>' | '<' | '^'

const calculateArrowsForNumbers = (numberButtons: NumButton[]) => {
	let numpadPosition: XY = [2, 3] // Start at A
	const presses: ArrowButton[] = []
	for (const numButton of numberButtons) {
		const newButtonXY = numericPadMap[numButton]
		const [dx, dy] = diffXY(newButtonXY, numpadPosition)
		const leftRightPress = new Array(Math.abs(dx)).fill(dx > 0 ? '>' : '<')
		const upDownPresses = new Array(Math.abs(dy)).fill(dy > 0 ? 'v' : '^')
		const arrowPresses: ArrowButton[] = []
		if (numpadPosition[1] === 3 && newButtonXY[0] === 0) {
			arrowPresses.push(...upDownPresses, ...leftRightPress)
		} else {
			arrowPresses.push(...leftRightPress, ...upDownPresses)
			arrowPresses.sort(sortArrowPresses)
		}
		presses.push(...arrowPresses, 'A')
		numpadPosition = [...newButtonXY]
	}
	return presses
}

const arrowSort: ArrowButton[] = ['>', '^', 'v', '<']
const sortArrowPresses = (a: ArrowButton, b: ArrowButton) =>
	arrowSort.indexOf(b) - arrowSort.indexOf(a)

const calculateArrowPresses = (targetButtons: ArrowButton[]) => {
	let presses: ArrowButton[] = []
	let runningChunk = ''
	for (let i = 0; i < targetButtons.length; i++) {
		const button = targetButtons[i]
		runningChunk += button
		if (button === 'A') {
			const chunkPresses = calculateChunkPresses(runningChunk)
			runningChunk = ''
			presses.push(...(chunkPresses.split('') as ArrowButton[]))
		}
	}
	return presses
}

const calculateChunkPresses = (chunk: string) => {
	let presses = ''
	let currentButton: ArrowButton = 'A'
	for (let b = 0; b < chunk.length; b++) {
		const button = chunk[b] as ArrowButton
		const buttonToButton = currentButton + button
		const toNextButton = nextButtonMap[buttonToButton as keyof typeof nextButtonMap]
		presses += toNextButton
		currentButton = button
	}
	return presses
}

const nextButtonMap = {
	'AA': 'A',
	'A^': '<A',
	'A<': 'v<<A',
	'A>': 'vA',
	'Av': '<vA',
	'^^': 'A',
	'^A': '>A',
	'^<': 'v<A',
	'^>': 'v>A',
	'<<': 'A',
	'<A': '>>^A',
	'<^': '>^A',
	'<v': '>A',
	'vv': 'A',
	'vA': '^>A',
	'v>': '>A',
	'v<': '<A',
	'>>': 'A',
	'>A': '^A',
	'>^': '<^A',
}

const chunkToChunks: Record<Chunk, Chunk[]> = {
	'<A': ['v<<A', '>>^A'],
	'>A': ['vA', '^A'],
	'v<<A': ['<vA', '<A', 'A', '>>^A'],
	'A': ['A'],
	'>>^A': ['vA', 'A', '<^A', '>A'],
	'vA': ['<vA', '^>A'],
	'<^A': ['v<<A', '>^A', '>A'],
	'<vA': ['v<<A', '>A', '^>A'],
	'>^A': ['vA', '<^A', '>A'],
	'^A': ['<A', '>A'],
	'^>A': ['<A', 'v>A', '^A'],
	'v<A': ['<vA', '<A', '>>^A'],
	'v>A': ['<vA', '>A', '^A'],
}

type Chunk =
	| '<A'
	| '>A'
	| 'v<<A'
	| 'A'
	| '>>^A'
	| 'vA'
	| '<^A'
	| '<vA'
	| '>^A'
	| '^A'
	| 'v<A'
	| '^>A'
	| 'v>A'

const zeroChunkCounts: Record<Chunk, number> = {
	'<A': 0,
	'>A': 0,
	'v<<A': 0,
	'A': 0,
	'>>^A': 0,
	'vA': 0,
	'<^A': 0,
	'<vA': 0,
	'>^A': 0,
	'^A': 0,
	'v<A': 0,
	'^>A': 0,
	'v>A': 0,
}

const chunkify = (targetButtons: ArrowButton[]) => {
	const chunks: Chunk[] = []
	let runningChunk = ''
	for (let i = 0; i < targetButtons.length; i++) {
		const button = targetButtons[i]
		runningChunk += button
		if (button === 'A') {
			chunks.push(runningChunk as Chunk)
			runningChunk = ''
		}
	}
	return chunks
}

export const getPart1Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let complexitySum = 0
	for (const [sequence, value] of parsed) {
		let currentArrowPadPresses = calculateArrowsForNumbers(sequence)
		let finalPresses = 0
		for (let i = 1; i < 3; i++) {
			if (i < 2) {
				currentArrowPadPresses = calculateArrowPresses(currentArrowPadPresses)
			} else {
				const chunkified = chunkify(currentArrowPadPresses)
				for (const chunk of chunkified) {
					const toChunks = chunkToChunks[chunk]
					if (!toChunks) console.error(chunk)
					finalPresses += toChunks.join('').length
				}
			}
		}
		complexitySum += value * finalPresses
	}
	console.log('p1', example ? 'example' : 'actual', complexitySum)
	return complexitySum
}

export const part1Examples: Example[] = [
	[
		`029A
980A
179A
456A
379A`,
		'126384',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let complexitySum = 0
	const switchToChunksAt = 2
	for (const [sequence, value] of parsed) {
		let currentArrowPadPresses = calculateArrowsForNumbers(sequence)
		let currentChunkCounts = { ...zeroChunkCounts }
		let transforms = 0
		for (let i = 1; i < 26; i++) {
			if (i < switchToChunksAt) {
				currentArrowPadPresses = calculateArrowPresses(currentArrowPadPresses)
				transforms++
			} else if (i === switchToChunksAt) {
				const chunkified = chunkify(currentArrowPadPresses)
				for (const chunk of chunkified) {
					currentChunkCounts[chunk]++
				}
			}
			if (i >= switchToChunksAt) {
				const nextChunkCounts = { ...zeroChunkCounts }
				for (const [chunk, count] of Object.entries(currentChunkCounts)) {
					const toChunks = chunkToChunks[chunk as Chunk]
					for (const toChunk of toChunks) {
						nextChunkCounts[toChunk] += count
					}
				}
				currentChunkCounts = nextChunkCounts
			}
		}
		let totalPresses = 0
		for (const [chunk, count] of Object.entries(currentChunkCounts)) {
			totalPresses += chunk.length * count
		}
		complexitySum += value * totalPresses
	}
	return complexitySum
}

export const part2Examples: Example[] = []
