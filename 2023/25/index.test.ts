import { expect, test } from 'bun:test'
import { getPart1Answer, part1Examples } from '.'
import { logAnswer } from '@scripts/log'

const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text()

test('solutions', () => {
	console.log('  🌟 Part 1 answer:', getAndLogAnswer())
	part1Examples.forEach(([i, a]) => expect(`${getPart1Answer(i)}`).toBe(`${a}`))
	expect(1).toBe(1) // Ensures that console logs always run
})

function getAndLogAnswer() {
	console.time(`P1`)
	const answer = `${getPart1Answer(inputText)}`
	console.timeEnd(`P1`)
	logAnswer(import.meta.dir, 1, answer)
	return answer
}
