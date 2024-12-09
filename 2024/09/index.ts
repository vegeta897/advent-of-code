const parseInput = (input: string) => {
	return input
		.trim()
		.split('')
		.map((v) => +v)
}

const getChecksum = (fs: (number | null)[]) =>
	fs.reduce((p, v, i) => p! + (v || 0) * i, 0)!

export const getPart1Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	let fs: (number | null)[] = []
	let readPosition = 0
	let fileID = 0
	for (let i = 0; i < parsed.length; i++) {
		const value = parsed[i]
		if (i % 2 === 0) {
			for (let b = 0; b < value; b++) {
				fs.push(fileID)
			}
			fileID++
		} else {
			for (let b = 0; b < value; b++) {
				fs.push(null)
			}
		}
		readPosition += value
	}
	let writePosition = 0
	while (true) {
		let block: null | number
		do {
			block = fs.pop()!
		} while (block === null)
		let moved = false
		for (let i = writePosition; i < fs.length; i++) {
			if (fs[i] === null) {
				fs[i] = block
				writePosition = i + 1
				moved = true
				break
			}
		}
		if (moved === false) {
			fs.push(block)
			break
		}
	}
	return getChecksum(fs)
}

export const part1Examples: Example[] = [[`2333133121414131402`, '1928']]

export const getPart2Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	const files: [position: number, size: number][] = []
	let fs: (number | null)[] = []
	let readPosition = 0
	for (let i = 0; i < parsed.length; i++) {
		const value = parsed[i]
		if (i % 2 === 0) {
			const fileID = files.length
			for (let b = 0; b < value; b++) {
				fs.push(fileID)
			}
			files.push([readPosition, value])
		} else {
			for (let b = 0; b < value; b++) {
				fs.push(null)
			}
		}
		readPosition += value
	}
	for (let f = files.length - 1; f >= 0; f--) {
		const [filePosition, fileSize] = files[f]
		for (let i = 0; i < filePosition; i++) {
			if (fs[i] !== null) continue
			const sufficientSpace = fs.slice(i, i + fileSize).every((b) => b === null)
			if (sufficientSpace) {
				for (let b = 0; b < fileSize; b++) {
					fs[i + b] = f
					fs[filePosition + b] = null
				}
				break
			}
		}
	}
	return getChecksum(fs)
}

export const part2Examples: Example[] = [[part1Examples[0][0], '2858']]
