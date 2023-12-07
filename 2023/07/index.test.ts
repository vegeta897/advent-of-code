import { expect, test } from 'bun:test'
import { getPart1Answer, getPart2Answer, part1Examples, part2Examples } from '.'

const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text()

test('solutions', () => {
	console.log('  🌟 Part 1 answer:', getPart1Answer(inputText))
	part1Examples.forEach(([i, a]) => expect(`${getPart1Answer(i)}`).toBe(`${a}`))
	part2Examples.forEach(([i, a]) => expect(`${getPart2Answer(i)}`).toBe(`${a}`))
	console.log('🌟🌟 Part 2 answer:', getPart2Answer(inputText))
	expect(1).toBe(1) // Ensures that console logs always run
})
