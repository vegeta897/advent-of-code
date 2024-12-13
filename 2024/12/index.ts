import { getNeighbors, inBounds, toGrid, toXY } from '../util'

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
	const width = regionMap[0].length
	const height = regionMap.length
	const regionCorners = regionAreas.map(() => 0)
	for (let y = 0; y <= height; y++) {
		for (let x = 0; x <= width; x++) {
			const tl = y === 0 || x === 0 ? 0 : regionMap[y - 1][x - 1]
			const tr = y === 0 || x === width ? 0 : regionMap[y - 1][x]
			const br = y === height || x === width ? 0 : regionMap[y][x]
			const bl = y === height || x === 0 ? 0 : regionMap[y][x - 1]
			const corners = [tl, tr, br, bl]
			for (let c = 0; c < corners.length; c++) {
				const root = corners[c]
				const neighbors = [corners[(c + 3) % 4], corners[(c + 5) % 4]]
				const opposite = corners[(c + 2) % 4]
				const matchingNeighbors = neighbors.filter((n) => n === root)
				if (matchingNeighbors.length === 2 && opposite !== root) regionCorners[root]++
				if (matchingNeighbors.length === 0) regionCorners[root]++
			}
		}
	}
	let totalCost = 0
	for (let i = 1; i < regionAreas.length; i++) {
		totalCost += regionAreas[i] * regionCorners[i]
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
