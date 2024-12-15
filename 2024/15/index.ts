import { addXY, DIRS, equalXY, flipXY, inBounds, XY } from '../util'

const parseInput = (input: string, part2 = false) => {
	const [mapString, movesString] = input.trim().split('\n\n')
	let robotXY: XY | undefined
	let map: string[][]
	if (part2) {
		map = mapString.split('\n').map((line) => [line])
		map.forEach((line, y) => {
			const lineString = line.pop()!
			lineString.split('').forEach((v, x) => {
				if (v === '.') line.push('.', '.')
				else if (v === '@') {
					robotXY = [x * 2, y]
					line.push('.', '.')
				} else if (v === '#') line.push('#', '#')
				else if (v === 'O') line.push('[', ']')
			})
		})
	} else {
		map = mapString.split('\n').map((line, y) =>
			line.split('').map((v, x) => {
				if (v === '@') {
					robotXY = [x, y]
					return '.'
				}
				return v
			})
		)
	}
	const moves = movesString
		.replaceAll('\n', '')
		.split('')
		.map((v) => DIRS[arrows[v as '^']])
	if (!robotXY) throw 'robot not found!'
	return { map, robotXY, moves }
}

const arrows = {
	'^': 0,
	'>': 1,
	'v': 2,
	'<': 3,
}

const sumBoxes = (map: string[][]) => {
	let sum = 0
	for (let y = 0; y < map.length; y++) {
		const row = map[y]
		for (let x = 0; x < row.length; x++) {
			const cell = row[x]
			if (cell === 'O' || cell === '[') sum += y * 100 + x
		}
	}
	return sum
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { map, robotXY, moves } = parseInput(input)
	for (const moveXY of moves) {
		const [moveToX, moveToY] = addXY(robotXY, moveXY)
		const atMoveTo = map[moveToY][moveToX]
		if (atMoveTo === '#') continue
		if (atMoveTo === 'O') {
			let lookAheadXY: XY = [moveToX, moveToY]
			let okToMove = false
			while (inBounds(lookAheadXY, map)) {
				lookAheadXY = addXY(lookAheadXY, moveXY)
				const lookingAt = map[lookAheadXY[1]][lookAheadXY[0]]
				if (lookingAt === '.') {
					okToMove = true
					break
				}
				if (lookingAt === '#') break
			}
			if (!okToMove) continue
			const backMove = flipXY(moveXY)
			while (!equalXY(lookAheadXY, [moveToX, moveToY])) {
				map[lookAheadXY[1]][lookAheadXY[0]] = 'O'
				lookAheadXY = addXY(lookAheadXY, backMove)
			}
			map[lookAheadXY[1]][lookAheadXY[0]] = '.'
		}
		robotXY[0] = moveToX
		robotXY[1] = moveToY
	}
	return sumBoxes(map)
}

export const part1Examples: Example[] = [
	[
		`########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
		'2028',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const { map, robotXY, moves } = parseInput(input, true)
	for (const moveXY of moves) {
		const moveToXY = addXY(robotXY, moveXY)
		const [moveToX, moveToY] = moveToXY
		const atMoveTo = map[moveToY][moveToX]
		if (atMoveTo === '#') continue
		if (atMoveTo === '[' || atMoveTo === ']') {
			let boxesToMove: [XY, XY][] = [
				[[...moveToXY], addXY(moveToXY, [atMoveTo === '[' ? 1 : -1, 0])],
			]
			let cannotMove = false
			while (true) {
				let foundMoreBoxes = false
				for (const box of boxesToMove) {
					const boxMoveTo: [XY, XY] = [addXY(box[0], moveXY), addXY(box[1], moveXY)]
					for (const boxMoveToXY of boxMoveTo) {
						const atBoxMoveTo = map[boxMoveToXY[1]][boxMoveToXY[0]]
						if (atBoxMoveTo === '#') {
							cannotMove = true
							break
						}
						if (atBoxMoveTo === '[' || atBoxMoveTo === ']') {
							const unknownBox = !boxesToMove.find((btm) =>
								btm.some((bp) => equalXY(bp, boxMoveToXY))
							)
							if (unknownBox) {
								boxesToMove.push([
									[...boxMoveToXY],
									addXY(boxMoveToXY, [atBoxMoveTo === '[' ? 1 : -1, 0]),
								])
								foundMoreBoxes = true
							}
						}
					}
					if (cannotMove) break
				}
				if (!foundMoreBoxes) break
			}
			if (cannotMove) continue
			boxesToMove.reverse()
			for (const boxToMoveXY of boxesToMove) {
				const boxUpdate: [XY, string][] = []
				for (let h = 0; h < 2; h++) {
					const boxHalfXY = boxToMoveXY[h]
					const boxHalfPiece = map[boxHalfXY[1]][boxHalfXY[0]]
					const boxHalfMoveToXY = addXY(boxHalfXY, moveXY)
					map[boxHalfXY[1]][boxHalfXY[0]] = '.'
					boxUpdate.push([boxHalfMoveToXY, boxHalfPiece])
				}
				for (const [updateMove, updateValue] of boxUpdate) {
					map[updateMove[1]][updateMove[0]] = updateValue
				}
			}
		}
		robotXY[0] = moveToX
		robotXY[1] = moveToY
	}
	return sumBoxes(map)
}

export const part2Examples: Example[] = [
	[
		`##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
		'9021',
	],
]
