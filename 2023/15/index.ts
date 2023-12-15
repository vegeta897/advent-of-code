const parseInput = (input: string) => input.trim().split(',')

export const getPart1Answer: Answer = (input: string): string | number => {
	const codes = parseInput(input)
	return codes.reduce((a, c) => a + getHash(c), 0)
}

export const part1Examples: Example[] = [
	[`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`, '1320'],
]

function getHash(code: string) {
	let currentValue = 0
	for (let c = 0; c < code.length; c++) {
		const char = code[c]
		const asciiValue = char.charCodeAt(0)
		currentValue += asciiValue
		currentValue *= 17
		currentValue %= 256
	}
	return currentValue
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const codes = parseInput(input)
	const boxes: string[][] = []
	const labelToBoxNumberMap: Map<string, number> = new Map()
	const labelToFocalLengthMap: Map<string, number> = new Map()
	for (const code of codes) {
		if (code.at(-1) === '-') {
			const label = code.slice(0, code.length - 1)
			const lensInBoxNumber = labelToBoxNumberMap.get(label)
			if (lensInBoxNumber === undefined) continue
			labelToBoxNumberMap.delete(label)
			const box = boxes[lensInBoxNumber]
			const lensIndex = box.indexOf(label)
			box.splice(lensIndex, 1)
		} else {
			// equals
			const [label, focalLength] = code.split('=')
			if (labelToBoxNumberMap.has(label)) {
				labelToFocalLengthMap.set(label, +focalLength)
				continue
			}
			const boxNumber = getHash(label)
			if (!boxes[boxNumber]) {
				boxes[boxNumber] = [label]
			} else {
				boxes[boxNumber].push(label)
			}
			labelToBoxNumberMap.set(label, boxNumber)
			labelToFocalLengthMap.set(label, +focalLength)
		}
	}
	let sum = 0
	for (let i = 0; i < boxes.length; i++) {
		const box = boxes[i]
		if (!box) continue
		for (let l = 0; l < box.length; l++) {
			sum += (i + 1) * (l + 1) * labelToFocalLengthMap.get(box[l])!
		}
	}
	return sum
}

export const part2Examples: Example[] = [[part1Examples[0][0], '145']]
