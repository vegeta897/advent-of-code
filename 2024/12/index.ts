import { getNeighbors, inBounds, rotateMap, toGrid, toXY } from '../util'

const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(''))
}

export const getPart1Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	const regionIDs: number[][] = parsed.map((row) => row.map((_) => 0))
	let nextRegionID = 0
	let totalCost = 0
	for (let y = 0; y < parsed.length; y++) {
		const row = parsed[y]
		for (let x = 0; x < row.length; x++) {
			const existingRegionID = regionIDs[y][x]
			if (existingRegionID > 0) continue
			nextRegionID++
			let area = 0
			let perimeter = 0
			const plot = row[x]
			const openPlots = new Set([toGrid(x, y)])
			while (openPlots.size > 0) {
				const thisPlot = [...openPlots][0]
				openPlots.delete(thisPlot)
				area++
				perimeter += 4
				const [thisX, thisY] = toXY(thisPlot)
				regionIDs[thisY][thisX] = nextRegionID
				const neighbors = getNeighbors(thisX, thisY)
				for (const [nx, ny] of neighbors) {
					if (!inBounds([nx, ny], parsed)) continue
					if (parsed[ny][nx] !== plot) continue
					if (regionIDs[ny][nx] === nextRegionID) perimeter -= 2
					if (regionIDs[ny][nx] > 0) continue
					openPlots.add(toGrid(nx, ny))
				}
			}
			totalCost += area * perimeter
		}
	}
	return totalCost
}

export const part1Examples: Example[] = [
	[
		`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
		'1930',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const map = parseInput(input)
	const regionMap: number[][] = map.map((row) => row.map((_) => 0))
	const regionAreas: number[] = [0]
	let nextRegionID = 0
	for (let y = 0; y < map.length; y++) {
		const row = map[y]
		for (let x = 0; x < row.length; x++) {
			const existingRegionID = regionMap[y][x]
			if (existingRegionID > 0) continue
			nextRegionID++
			let area = 0
			const plot = row[x]
			const openPlots = new Set([toGrid(x, y)])
			while (openPlots.size > 0) {
				const thisPlot = [...openPlots][0]
				openPlots.delete(thisPlot)
				area++
				const [thisX, thisY] = toXY(thisPlot)
				regionMap[thisY][thisX] = nextRegionID
				const neighbors = getNeighbors(thisX, thisY)
				for (const [nx, ny] of neighbors) {
					if (!inBounds([nx, ny], map)) continue
					if (map[ny][nx] !== plot) continue
					if (regionMap[ny][nx] > 0) continue
					openPlots.add(toGrid(nx, ny))
				}
			}
			regionAreas[nextRegionID] = area
		}
	}
	const regionSides = regionAreas.map(() => 0)
	let rotatedMap = regionMap
	for (let r = 0; r < 4; r++) {
		rotatedMap = rotateMap(rotatedMap)
		for (let y = 0; y < rotatedMap.length; y++) {
			let prevRegionID = 0
			let prevContiguous = true
			for (let x = 0; x < rotatedMap[0].length; x++) {
				const above = y === 0 ? 0 : rotatedMap[y - 1][x]
				const currentRegionID = rotatedMap[y][x]
				const contiguous = above === currentRegionID
				if (prevRegionID > 0 && !prevContiguous) {
					if (contiguous || prevRegionID !== currentRegionID) {
						regionSides[prevRegionID]++
					}
				}
				prevRegionID = currentRegionID
				prevContiguous = contiguous
			}
			if (!prevContiguous) regionSides[prevRegionID]++
		}
	}
	let totalCost = 0
	for (let i = 1; i < regionAreas.length; i++) {
		totalCost += regionAreas[i] * regionSides[i]
	}
	return totalCost
}

export const part2Examples: Example[] = [
	[
		`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
		'236',
	],
	[part1Examples[0][0], '1206'],
]
