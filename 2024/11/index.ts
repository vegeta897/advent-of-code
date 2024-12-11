const parseInput = (input: string) => {
	return input
		.trim()
		.split(' ')
		.map((v) => +v)
}

const solveBlinks = (totalBlinks: number, numbers: number[]) => {
	const cache: number[][] = []
	const blinkStages = new Array(totalBlinks + 1)
		.fill(0)
		.map((_) => [] as [number, number][])
	blinkStages[0] = numbers.map((num) => [num, 1])
	let totalNumbers = numbers.length
	// let lastTime = performance.now()
	for (let b = 0; b < totalBlinks; b++) {
		const blinkStage = blinkStages[b]
		// console.log(
		// 	`b=${b}`,
		// 	blinkStage.length,
		// 	`${Math.floor(performance.now() - lastTime)}ms`,
		// 	`cache size: ${cache.filter((v) => v).length}`
		// )
		// lastTime = performance.now()
		for (let i = 0; i < blinkStage.length; i++) {
			const [stoneNumber, stoneCount] = blinkStage[i]
			const cached = cache[stoneNumber] || calcSplits(cache, stoneNumber, totalBlinks - b)
			cache[stoneNumber] = cached
			for (let s = 0; s < totalBlinks - b; s++) {
				const cacheNum = cached[s]
				if (cacheNum !== undefined) {
					totalNumbers += stoneCount
					const blinkStage = blinkStages[b + 1 + s]
					const numInBlinkStage = blinkStage.find(([num]) => num === cacheNum)
					if (numInBlinkStage) {
						numInBlinkStage[1] += stoneCount
					} else {
						blinkStages[b + 1 + s].push([cacheNum, stoneCount])
					}
				}
			}
		}
	}
	return totalNumbers
}

const calcSplits = (cache: number[][], num: number, blinks: number): number[] => {
	const sparseSplits: number[] = []
	for (let b = 0; b < blinks; b++) {
		const cached = cache[num]
		if (cached !== undefined) {
			for (let c = 0; c < blinks - b; c++) {
				const cachedValue = cached[c]
				if (cachedValue !== undefined) {
					sparseSplits[b + c] = cachedValue
				}
			}
			break
		}
		if (num === 0) {
			num = 1
			continue
		}
		const numString = num.toString()
		if (numString.length % 2 === 0) {
			const rightSplit = +numString.substring(numString.length / 2, numString.length)
			sparseSplits[b] = rightSplit
			num = +numString.substring(0, numString.length / 2)
			continue
		}
		num *= 2024
	}
	return sparseSplits
}

export const getPart1Answer: Answer = (input, example = false) => {
	return solveBlinks(25, parseInput(input))
}

export const part1Examples: Example[] = [[`125 17`, '55312']]

export const getPart2Answer: Answer = (input, example = false) => {
	return solveBlinks(75, parseInput(input))
}

export const part2Examples: Example[] = []
