import { expect, test } from 'bun:test'
import { getPart1Answer, getPart2Answer, part1Examples, part2Examples } from '.'
import { logAnswer } from '@scripts/log'

const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text()

test('solutions', () => {
	console.log('  🌟 Part 1 answer:', getAndLogAnswer(1))
	part1Examples.forEach(([i, a]) => expect(`${getPart1Answer(i)}`).toBe(`${a}`))
	console.log('🌟🌟 Part 2 answer:', getAndLogAnswer(2))
	part2Examples.forEach(([i, a]) => expect(`${getPart2Answer(i)}`).toBe(`${a}`))
	expect(1).toBe(1) // Ensures that console logs always run
})

function getAndLogAnswer(part: 1 | 2) {
	console.time(`P${part}`)
	const answer = `${(part === 1 ? getPart1Answer : getPart2Answer)(inputText)}`
	console.timeEnd(`P${part}`)
	logAnswer(import.meta.dir, part, answer)
	return answer
}
