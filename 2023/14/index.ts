const parseInput = (input: string) => {
	const rows = input.trim().split('\n')
	const size = rows.length
	const mapByColumn: string[][] = []
	rows.forEach((line, y) => {
		line.split('').forEach((char, x) => {
			if (!mapByColumn[x]) mapByColumn[x] = []
			mapByColumn[x][y] = char
		})
	})
	return { mapByColumn, size }
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { mapByColumn, size } = parseInput(input)
	let totalLoad = 0
	for (const column of mapByColumn) {
		for (let y = 0; y < column.length; y++) {
			const char = column[y]
			if (char !== 'O') continue
			let above = y - 1
			while (above >= 0 && column[above] === '.') {
				column[above + 1] = '.'
				column[above] = 'O'
				above--
			}
			const final = above + 1
			const load = size - final
			totalLoad += load
		}
	}
	return totalLoad
}

export const part1Examples: Example[] = [
	[
		`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
		'136',
	],
]

function rotateMap(map: string[], size: number) {
	// rotate map 90 degrees clock-wise
	const rotMap: string[] = []
	for (let a = 0; a < size; a++) {
		const str = map[a]
		for (let b = 0; b < size; b++) {
			const newColumn = size - 1 - b
			if (!rotMap[newColumn]) {
				rotMap[newColumn] = str[b]
			} else {
				rotMap[newColumn] += str[b]
			}
		}
	}
	return rotMap
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const { mapByColumn, size } = parseInput(input)
	let mapByColumnString = mapByColumn.map((col) => col.join(''))
	const mapCache: Map<string, string[]> = new Map()
	const mapCacheKeys: string[] = []
	let highestMapCacheKeyIndex = 0
	let highestMapCacheKeyIndexCycle = -1
	let highestMatched = false
	let resumeR = -1
	const columnCache: Map<string, string> = new Map()
	const cycles = 1000000000
	for (let i = 0; i < cycles; i++) {
		let startR = 0
		if (resumeR >= 0) {
			startR = resumeR
			resumeR = -1
		}
		for (let r = startR; r < 4; r++) {
			const mapCacheKey = mapByColumnString.join('')
			const cachedMap = mapCache.get(mapCacheKey)
			if (cachedMap) {
				if (!highestMatched) {
					const mapCacheKeyIndex = mapCacheKeys.indexOf(mapCacheKey)
					if (mapCacheKeyIndex > highestMapCacheKeyIndex) {
						highestMapCacheKeyIndex = mapCacheKeyIndex
						highestMapCacheKeyIndexCycle = i
					} else if (mapCacheKeyIndex === highestMapCacheKeyIndex) {
						const superCycleLength = i - highestMapCacheKeyIndexCycle
						highestMatched = true
						highestMapCacheKeyIndexCycle = i
						const superCyclesLeft = Math.floor((cycles - i) / superCycleLength)
						const skipCycles = superCyclesLeft * superCycleLength - 1
						i += skipCycles
						resumeR = r
						break
					}
				}
				mapByColumnString = cachedMap
				continue
			}
			for (let c = 0; c < size; c++) {
				const columnString = mapByColumnString[c]
				const cachedColumn = columnCache.get(columnString)
				if (cachedColumn) {
					mapByColumnString[c] = cachedColumn
					continue
				}
				const column = columnString.split('')
				for (let y = 0; y < column.length; y++) {
					const char = column[y]
					if (char !== 'O') continue
					let above = y - 1
					while (above >= 0 && column[above] === '.') {
						column[above + 1] = '.'
						column[above] = 'O'
						above--
					}
				}
				const rolledColumn = column.join('')
				columnCache.set(columnString, rolledColumn)
				mapByColumnString[c] = rolledColumn
			}
			const rotatedMap = rotateMap(mapByColumnString, size)
			mapCache.set(mapCacheKey, rotatedMap)
			mapCacheKeys.push(mapCacheKey)
			mapByColumnString = rotatedMap
		}
	}
	return weighMap(mapByColumnString)
}

function weighMap(map: string[]) {
	let totalLoad = 0
	for (const column of map) {
		for (let c = 0; c < map.length; c++) {
			if (column[c] === 'O') totalLoad += map.length - c
		}
	}
	return totalLoad
}

export const part2Examples: Example[] = [[part1Examples[0][0], '64']]

function logMapToConsole(map: string[]) {
	let str = ''
	for (let y = 0; y < map.length; y++) {
		let row = ''
		for (let x = 0; x < map.length; x++) {
			row += map[x][y] + ' '
		}
		str += row + '\n'
	}
	console.log(str)
}
