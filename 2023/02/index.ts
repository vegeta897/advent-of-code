const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line, i) => {
			const results = line.split(':')[1].trim()
			return {
				game: i + 1,
				subsets: results
					.split('; ')
					.map((subset) => subset.split(', ').map((r) => r.split(' '))),
			}
		})
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const possibleGames = parsed.filter(
		(g) =>
			!g.subsets.some((s) =>
				s.some(([cubes, color]) => {
					if (color === 'red' && +cubes > 12) return true
					if (color === 'green' && +cubes > 13) return true
					if (color === 'blue' && +cubes > 14) return true
				})
			)
	)
	return possibleGames.map((g) => g.game).reduce((a, c) => a + c, 0)
}

export const part1Examples: Example[] = [
	[
		`Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
		8,
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const minCubes = parsed.map((game) => {
		const fewest = {
			red: 0,
			green: 0,
			blue: 0,
		}
		type Color = keyof typeof fewest
		for (const subset of game.subsets) {
			for (const [cubes, color] of subset) {
				if (+cubes > fewest[color as Color]) fewest[color as Color] = +cubes
			}
		}
		return fewest.red * fewest.green * fewest.blue
	})
	return minCubes.reduce((a, c) => a + c, 0)
}

export const part2Examples: Example[] = [[part1Examples[0][0], 2286]]
