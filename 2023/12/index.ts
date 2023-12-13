const parseInput = (input: string, part2 = false) => {
	return input
		.trim()
		.split('\n')
		.map((line) => {
			let [picrossString, groupsString] = line.split(' ')
			if (part2) {
				picrossString = Array(5).fill(picrossString).join('?')
				groupsString = Array(5).fill(groupsString).join(',')
			}
			const clusters = picrossString.split(/\.+/).filter((c) => c)
			return {
				picross: clusters.join('.'), // trim "." at start and end, and repeated "."
				groups: groupsString.split(',').map((v) => +v),
			}
		})
}

function isSolutionValid(picross: string, groups: number[]) {
	const clusters = picross.split(/\.+/).filter((c) => c)
	if (clusters.length !== groups.length) return false
	return !clusters.some((c, i) => c.length !== groups[i])
}

function getTotalArrangements(puzzles: ReturnType<typeof parseInput>) {
	let totalArrangements = 0
	const cache: Map<string, number> = new Map()
	for (const { groups, picross } of puzzles) {
		const totalBroken = groups.reduce((a, c) => a + c, 0)
		const minimumSolutionLength = totalBroken + (groups.length - 1)
		if (picross.length === minimumSolutionLength) {
			// Only one possible arrangement
			totalArrangements++
			continue
		}
		const totalKnownBroken = (picross.match(/#/g) || []).length
		const totalUnknownBroken = totalBroken - totalKnownBroken
		const totalUnknownAny = (picross.match(/\?/g) || []).length
		if (totalUnknownAny === totalUnknownBroken) {
			// All unknown are broken, only one possible arrangement
			totalArrangements++
			continue
		}
		const totalUnknownSpaces = totalUnknownAny - totalUnknownBroken
		function permute(
			solution: string,
			char: Char,
			charIndex: number,
			gIndex: number,
			brokenLeft: number,
			spacesLeft: number
		): number {
			if (brokenLeft === 0 && spacesLeft === 0) {
				if (char !== '#') return 1
				const finalSolution = solution + (char || '') + picross.slice(charIndex + 1)
				if (isSolutionValid(finalSolution, groups)) return 1
				return 0
			}
			if (char === '#') {
				const groupSize = groups[gIndex] // new cluster
				if (!groupSize) return 0 // invalid
				let resumeCharIndex = charIndex + groupSize
				const resumeChar = picross[resumeCharIndex]
				if (resumeChar === '#' || (resumeChar === '?' && spacesLeft === 0)) return 0 // invalid
				const remainingPicross = '#' + picross.slice(charIndex + 1)
				const cacheKey = `${remainingPicross}:${groups
					.slice(gIndex)
					.join(',')}:${brokenLeft}`
				const cached = cache.get(cacheKey) ?? -1
				if (cached >= 0) return cached // the key to success
				for (let n = 1; n < groupSize; n++) {
					let nextChar = picross[charIndex + n]
					if (!nextChar) return 0 // invalid
					if (nextChar === '.') return 0 // invalid
					if (nextChar === '?') brokenLeft--
				}
				solution += '#'.repeat(groupSize)
				if (resumeChar === '?') {
					spacesLeft--
					resumeCharIndex++
					solution += '.'
				}
				const solutionsToCache = permute(
					solution,
					picross[resumeCharIndex] as Char,
					resumeCharIndex,
					gIndex + 1,
					brokenLeft,
					spacesLeft
				)
				cache.set(cacheKey, solutionsToCache)
				return solutionsToCache
			} else if (char === '.') {
				return permute(
					solution + '.',
					picross[charIndex + 1] as Char,
					charIndex + 1,
					gIndex,
					brokenLeft,
					spacesLeft
				)
			} else {
				// unknown char
				let moreSolutions = 0
				if (brokenLeft > 0) {
					moreSolutions += permute(
						solution,
						'#',
						charIndex,
						gIndex,
						brokenLeft - 1,
						spacesLeft
					)
				}
				if (spacesLeft > 0) {
					moreSolutions += permute(
						solution,
						'.',
						charIndex,
						gIndex,
						brokenLeft,
						spacesLeft - 1
					)
				}
				return moreSolutions
			}
		}
		const arrangements = permute(
			'',
			picross[0] as Char,
			0,
			0,
			totalUnknownBroken,
			totalUnknownSpaces
		)
		totalArrangements += arrangements
	}
	return totalArrangements
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const puzzles = parseInput(input)
	return getTotalArrangements(puzzles)
}

export const part1Examples: Example[] = [
	[
		`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
		'21',
	],
]

type Char = '#' | '.' | '?'

export const getPart2Answer: Answer = (input: string): string | number => {
	const puzzles = parseInput(input, true)
	return getTotalArrangements(puzzles)
}

export const part2Examples: Example[] = [[part1Examples[0][0], '525152']]
