const parseInput = (input: string) => {
	const map: Map<string, number> = new Map()
	const bricks = input
		.trim()
		.split('\n')
		.map((line, id) => {
			const [start, end] = line.split('~')
			let [sx, sy, sz, ex, ey, ez] = [...start.split(','), ...end.split(',')].map(
				(v) => +v
			)
			for (let x = sx; x <= ex; x++) {
				for (let y = sy; y <= ey; y++) {
					for (let z = sz; z <= ez; z++) {
						const grid = toGrid(x, y, z)
						map.set(grid, id)
					}
				}
			}
			const supports: Set<number> = new Set()
			const supportedBy: Set<number> = new Set()
			return { sx, sy, sz, ex, ey, ez, id, supports, supportedBy }
		})
	return { map, bricks }
}

const toGrid = (x: number, y: number, z: number) => `${x},${y},${z}`

function fall(
	{ map, bricks }: ReturnType<typeof parseInput>,
	brick: ReturnType<typeof parseInput>['bricks'][number]
) {
	let downZ = brick.sz
	let brickBelow = false
	while (downZ > 1 && !brickBelow) {
		downZ--
		for (let x = brick.sx; x <= brick.ex; x++) {
			for (let y = brick.sy; y <= brick.ey; y++) {
				const downGrid = toGrid(x, y, downZ)
				const downBrickId = map.get(downGrid)
				if (downBrickId !== undefined) {
					const downBrick = bricks.find((b) => b.id === downBrickId)!
					downBrick.supports.add(brick.id)
					brick.supportedBy.add(downBrickId)
					brickBelow = true
				}
			}
		}
		if (!brickBelow) {
			brick.sz--
			brick.ez--
			for (let x = brick.sx; x <= brick.ex; x++) {
				for (let y = brick.sy; y <= brick.ey; y++) {
					map.delete(toGrid(x, y, brick.ez + 1))
					map.set(toGrid(x, y, brick.sz), brick.id)
				}
			}
		}
	}
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const { bricks } = parsed
	const sortedBricks = [...bricks].sort((a, b) => a.sz - b.sz)
	const canDissolve: Set<number> = new Set()
	for (const brick of sortedBricks) {
		if (brick.sz === 1) continue
		fall(parsed, brick)
	}
	for (const brick of bricks) {
		if (brick.supportedBy.size > 1) {
			brick.supportedBy.forEach((b) => {
				const onlySupportFor = bricks.find(
					(o) => o.supportedBy.size === 1 && o.supportedBy.has(b)
				)
				if (!onlySupportFor) canDissolve.add(b)
			})
		}
		if (brick.supports.size === 0) {
			canDissolve.add(brick.id)
		}
	}
	return canDissolve.size
}

export const part1Examples: Example[] = [
	[
		`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`,
		'5',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const { bricks } = parsed
	const sortedBricks = [...bricks].sort((a, b) => a.sz - b.sz)
	for (const brick of sortedBricks) {
		if (brick.sz === 1) continue
		fall(parsed, brick)
	}
	let totalFallen = 0
	for (const dissolveBrick of bricks) {
		if (dissolveBrick.supports.size === 0) continue
		const fallBricks: Set<number> = new Set()
		function traverseSupported(supported: Set<number>) {
			supported.forEach((b) => {
				const supportedBrick = bricks[b]
				if (
					[...supportedBrick.supportedBy].every(
						(sb) => sb === dissolveBrick.id || fallBricks.has(sb)
					)
				) {
					fallBricks.add(b)
					traverseSupported(supportedBrick.supports)
				}
			})
		}
		traverseSupported(dissolveBrick.supports)
		totalFallen += fallBricks.size
	}
	return totalFallen
}

export const part2Examples: Example[] = [[part1Examples[0][0], '7']]
