import { toGrid, XY } from '../util'

const parseInput = (input: string) => {
	const lines = input.trim().split('\n')
	let width = lines[0].length
	let height = lines.length
	const nodesByChar: Map<string, XY[]> = new Map()
	lines.forEach((line, y) =>
		line.split('').forEach((char, x) => {
			if (char !== '.') {
				nodesByChar.set(char, [...(nodesByChar.get(char) || []), [x, y]])
			}
		})
	)
	return { nodesByChar, width, height }
}

const inBounds = ([x, y]: XY, width: number, height: number) =>
	x >= 0 && y >= 0 && x < width && y < height

export const getPart1Answer: Answer = (input, example = false) => {
	const { nodesByChar, width, height } = parseInput(input)
	const antiNodeGrids: Set<string> = new Set()
	for (const [_, nodes] of nodesByChar) {
		for (let n1 = 0; n1 < nodes.length; n1++) {
			const node1 = nodes[n1]
			for (let n2 = 0; n2 < nodes.length; n2++) {
				if (n2 === n1) continue
				const node2 = nodes[n2]
				const diff = [node2[0] - node1[0], node2[1] - node1[1]]
				const antiNode: XY = [node1[0] - diff[0], node1[1] - diff[1]]
				if (!inBounds(antiNode, width, height)) continue
				antiNodeGrids.add(toGrid(...antiNode))
			}
		}
	}
	return antiNodeGrids.size
}

export const part1Examples: Example[] = [
	[
		`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
		'14',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const { nodesByChar, width, height } = parseInput(input)
	const antiNodeGrids: Set<string> = new Set()
	for (const [_, nodes] of nodesByChar) {
		for (let n1 = 0; n1 < nodes.length; n1++) {
			const node1 = nodes[n1]
			antiNodeGrids.add(toGrid(...node1)) // All nodes are anti-nodes
			for (let n2 = n1 + 1; n2 < nodes.length; n2++) {
				const node2 = nodes[n2]
				const diff = [node2[0] - node1[0], node2[1] - node1[1]]
				let smallestDiff = [...diff] as XY
				for (let d = Math.min(...diff); d > 0; d--) {
					if (
						diff[0] / d === Math.round(diff[0] / d) &&
						diff[1] / d === Math.round(diff[1] / d)
					)
						smallestDiff = [diff[0] / d, diff[1] / d]
				}
				for (let dir of [-1, 1]) {
					let diffMult = dir
					while (true) {
						const antiNode: XY = [
							node1[0] - smallestDiff[0] * diffMult,
							node1[1] - smallestDiff[1] * diffMult,
						]
						if (!inBounds(antiNode, width, height)) break
						antiNodeGrids.add(toGrid(...antiNode))
						diffMult += dir
					}
				}
			}
		}
	}
	return antiNodeGrids.size
}

export const part2Examples: Example[] = [[part1Examples[0][0], '34']]
