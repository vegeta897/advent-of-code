import { expect, test } from 'bun:test'
import { getPart1Answer, getPart2Answer, part1Examples, part2Examples } from '.'

const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text()
const part1Answer = () => getPart1Answer(inputText)
const part2Answer = () => getPart2Answer(inputText)

test('solutions', () => {
	part1Examples.forEach(([input, answer]) => expect(getPart1Answer(input)).toBe(answer))
	console.log('Part 1 answer:', part1Answer())
	part2Examples.forEach(([input, answer]) => expect(getPart2Answer(input)).toBe(answer))
	console.log('Part 2 answer:', part2Answer())
})
