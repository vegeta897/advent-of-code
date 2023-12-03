const parseInput = (input: string) => {
	return input.trim().split('\n')
}

const isNum = (char: string) => !isNaN(+char)

type GearNumber = { y: number; startX: number; endX: number; number: number }

function getGearNumbers(input: string[]) {
	const gearNumbers: GearNumber[] = []
	for (let y = 0; y < input.length; y++) {
		const line = input[y]
		for (let x = 0; x < line.length; x++) {
			const char = line[x]
			if (!isNum(char)) continue
			let numberString = char
			const startX = x
			let endX = x + 1
			while (isNum(line[endX])) {
				numberString += line[endX]
				endX++
			}
			let isPartNumber = false
			for (let ny = Math.max(0, y - 1); ny <= y + 1; ny++) {
				if (isPartNumber) break
				if (!input[ny]) continue
				for (let nx = startX - 1; nx <= endX; nx++) {
					const nChar = input[ny][nx]
					if (nChar === undefined) continue
					if (!isNum(nChar) && nChar !== '.') {
						isPartNumber = true
						break
					}
				}
			}
			if (isPartNumber) {
				gearNumbers.push({
					y,
					startX,
					endX: endX - 1,
					number: parseInt(numberString),
				})
			}
			x = endX
		}
	}
	return gearNumbers
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const gearNumbers = getGearNumbers(parsed)
	return gearNumbers.map((g) => g.number).reduce((a, c) => a + c, 0)
}

export const part1Examples: Example[] = [
	[
		`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
		'4361',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const gearNumbers = getGearNumbers(parsed)
	let sum = 0
	for (let y = 0; y < parsed.length; y++) {
		const line = parsed[y]
		for (let x = 0; x < line.length; x++) {
			if (line[x] !== '*') continue
			const adjacentGears: Set<GearNumber> = new Set()
			for (let ny = Math.max(0, y - 1); ny <= y + 1; ny++) {
				if (!parsed[ny]) continue
				for (let nx = x - 1; nx <= x + 1; nx++) {
					if (ny === y && nx === x) continue // Skip * location
					if (!isNum(parsed[ny][nx])) continue // Skip non-numbers
					gearNumbers.forEach((nl) => {
						if (nl.y === ny && nx >= nl.startX && nx <= nl.endX) {
							adjacentGears.add(nl)
						}
					})
				}
			}
			if (adjacentGears.size === 2) {
				const numbers = [...adjacentGears.values()]
				sum += numbers[0].number * numbers[1].number
			}
		}
	}
	return sum
}

export const part2Examples: Example[] = [[part1Examples[0][0], '467835']]
