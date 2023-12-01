import { expect, test } from 'bun:test'
import { getPart1Answer, getPart2Answer, part1Examples, part2Examples } from '.'

const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text()

test('solutions', () => {
	part1Examples.forEach(([input, answer]) => expect(getPart1Answer(input)).toBe(answer))
	console.log('Part 1 answer:', getPart1Answer(inputText))
	part2Examples.forEach(([input, answer]) => expect(getPart2Answer(input)).toBe(answer))
	console.log('Part 2 answer:', getPart2Answer(inputText))
})
