const parseInput = (input: string) => {
	const [seedsStr, ...mapStrs] = input.trim().split('\n\n')
	const seeds = seedsStr // For part 1
		.split(': ')[1]
		.split(' ')
		.map((v) => +v)
	const seedRanges: Range[] = [] // For part 2
	for (let i = 0; i < seeds.length; i += 2) {
		seedRanges.push([seeds[i], seeds[i + 1]])
	}
	const maps = mapStrs.map((mapStr) => {
		const [name, data] = mapStr.split(' map:\n')
		const [from, to] = name.split('-to-') // Only used for logging
		let mapStart = Infinity
		let mapEnd = 0
		const mappings = data.split('\n').map((line) => {
			const [destStart, sourceStart, range] = line.split(' ').map((v) => +v)
			const sourceEnd = sourceStart + range - 1
			if (sourceStart < mapStart) mapStart = sourceStart
			if (sourceEnd > mapEnd) mapEnd = sourceEnd
			return { destStart, sourceStart, sourceEnd, range }
		})
		return { from, to, mappings, mapStart, mapEnd }
	})
	return { seeds, seedRanges, maps }
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const { seeds, maps } = parseInput(input)
	let lowestLocation = Infinity
	for (const seed of seeds) {
		let number = seed
		for (const map of maps) {
			for (const { sourceStart, destStart, range } of map.mappings) {
				if (number >= sourceStart && number <= sourceStart + range) {
					number = destStart + (number - sourceStart)
					break
				}
			}
		}
		if (number < lowestLocation) lowestLocation = number
	}
	return lowestLocation
}

export const part1Examples: Example[] = [
	[
		`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
		'35',
	],
]

type Range = [number, number]
type Maps = ReturnType<typeof parseInput>['maps']
type Mapping = Maps[number]['mappings'][number]

function processMap(maps: Maps, startMap: number, [start, end]: Range) {
	if (startMap === maps.length) return start
	let lowest = Infinity
	const map = maps[startMap]
	const destRanges: Range[] = []
	if (end >= map.mapStart && start <= map.mapEnd) {
		const mappingsToTry = map.mappings
			.filter(({ sourceStart, sourceEnd }) => !(start > sourceEnd || end < sourceStart))
			.map((m) => processMapping(m, start, end))
		destRanges.push(...mappingsToTry)
	}
	if (start < map.mapStart) {
		destRanges.push([start, Math.min(end, map.mapStart - 1)])
	}
	if (end > map.mapEnd) {
		destRanges.push([Math.max(map.mapEnd + 1, start), end])
	}
	for (const range of destRanges) {
		const result = processMap(maps, startMap + 1, range)
		if (result < lowest) lowest = result
	}
	return lowest
}

function processMapping(mapping: Mapping, start: number, end: number): Range {
	const overlapStart = Math.max(start, mapping.sourceStart)
	const overlapEnd = Math.min(end, mapping.sourceEnd)
	const offset = mapping.destStart - mapping.sourceStart
	start = overlapStart + offset
	end = overlapEnd + offset
	return [start, end]
}

export const getPart2Answer: Answer = (input: string): string | number => {
	const { seedRanges, maps } = parseInput(input)
	let lowestLocation = Infinity
	for (const [start, range] of seedRanges) {
		let seedStart = start
		let seedEnd = start + range - 1
		const result = processMap(maps, 0, [seedStart, seedEnd])
		if (result < lowestLocation) lowestLocation = result
	}
	return lowestLocation
}

export const part2Examples: Example[] = [[part1Examples[0][0], '46']]
