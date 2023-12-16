const parseInput = (input: string) => {
	const map = input
		.trim()
		.split('\n')
		.map((line) => line.split(''))
	return { map, size: map[0].length }
}

enum DIR {
	up = 0,
	right = 1,
	down = 2,
	left = 3,
}

const neighborXYs = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

type Beam = [x: number, y: number, dir: DIR]

function simulateBeam(beam: Beam, input: ReturnType<typeof parseInput>) {
	const { map, size } = input
	const beams: Beam[] = [beam]
	const energized: Set<string> = new Set()
	const beamHistory: Set<string> = new Set()
	for (let i = 0; i < beams.length; i++) {
		const beam = beams[i]
		while (true) {
			const toX = beam[0] + neighborXYs[beam[2]][0]
			const toY = beam[1] + neighborXYs[beam[2]][1]
			beam[0] = toX
			beam[1] = toY
			if (toX < 0 || toY < 0 || toX === size || toY === size) break
			const tile = map[toY][toX]
			if (tile === '|' && (beam[2] === DIR.right || beam[2] === DIR.left)) {
				beam[2] = DIR.up
				beams.push([toX, toY, DIR.down])
			} else if (tile === '-' && (beam[2] === DIR.up || beam[2] === DIR.down)) {
				beam[2] = DIR.left
				beams.push([toX, toY, DIR.right])
			} else if (tile === '/') {
				switch (beam[2]) {
					case DIR.up:
						beam[2] = DIR.right
						break
					case DIR.down:
						beam[2] = DIR.left
						break
					case DIR.left:
						beam[2] = DIR.down
						break
					case DIR.right:
						beam[2] = DIR.up
						break
				}
			} else if (tile === '\\') {
				switch (beam[2]) {
					case DIR.up:
						beam[2] = DIR.left
						break
					case DIR.down:
						beam[2] = DIR.right
						break
					case DIR.left:
						beam[2] = DIR.up
						break
					case DIR.right:
						beam[2] = DIR.down
						break
				}
			}
			const beamHash = beam.join(':')
			if (beamHistory.has(beamHash)) break
			energized.add(`${toX}:${toY}`)
			beamHistory.add(beamHash)
		}
	}
	return energized.size
}

export const getPart1Answer: Answer = (input: string): string | number => {
	return simulateBeam([-1, 0, DIR.right], parseInput(input))
}

export const part1Examples: Example[] = [
	[
		`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
		'46',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const { map, size } = parseInput(input)
	const possibleBeams: [x: number, y: number, dir: DIR][] = []
	for (let v = 0; v < size; v++) {
		possibleBeams.push([-1, v, DIR.right])
		possibleBeams.push([size, v, DIR.left])
		possibleBeams.push([v, -1, DIR.down])
		possibleBeams.push([v, size, DIR.up])
	}
	let highestEnergized = 0
	for (const possibleBeam of possibleBeams) {
		const energized = simulateBeam(possibleBeam, { map, size })
		if (energized > highestEnergized) highestEnergized = energized
	}
	return highestEnergized
}

export const part2Examples: Example[] = [[part1Examples[0][0], '51']]
