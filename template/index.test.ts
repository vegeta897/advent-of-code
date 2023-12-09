import { expect, test } from 'bun:test'
import { getPart1Answer, getPart2Answer, part1Examples, part2Examples } from '.'
import { logAnswer } from '@scripts/log'

const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text()

test('solutions', () => {
	part1Examples.forEach(([i, a]) => expect(`${getPart1Answer(i)}`).toBe(`${a}`))
	// console.log('  🌟 Part 1 answer:', getAndLogAnswer(1))
	part2Examples.forEach(([i, a]) => expect(`${getPart2Answer(i)}`).toBe(`${a}`))
	// console.log('🌟🌟 Part 2 answer:', getAndLogAnswer(2))
	expect(1).toBe(1) // Ensures that console logs always run
})

function getAndLogAnswer(part: 1 | 2) {
	const answer = `${(part === 1 ? getPart1Answer : getPart2Answer)(inputText)}`
	logAnswer(import.meta.dir, part, answer)
	return answer
}
