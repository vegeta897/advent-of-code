import test from 'node:test'
import type { TestContext } from 'node:test'
import fs from 'node:fs/promises'
import { getPart1Answer, getPart2Answer, part1Examples, part2Examples } from './index.ts'
import { logAnswer } from '#scripts/log.ts'

const inputText = await fs.readFile(`${import.meta.dirname}/input.txt`, 'utf-8')

test('solutions', (t: TestContext) => {
	console.log('  🌟 Part 1 answer:', getAndLogAnswer(1))
	part1Examples.forEach(([i, a]) => t.assert.strictEqual(`${getPart1Answer(i, true)}`, `${a}`))
	console.log('🌟🌟 Part 2 answer:', getAndLogAnswer(2))
	part2Examples.forEach(([i, a]) => t.assert.strictEqual(`${getPart2Answer(i, true)}`, `${a}`))
	t.assert.strictEqual(1, 1) // Ensures that console logs always run
})

function getAndLogAnswer(part: 1 | 2) {
	console.time(`P${part}`)
	const answer = `${(part === 1 ? getPart1Answer : getPart2Answer)(inputText)}`
	console.timeEnd(`P${part}`)
	logAnswer(import.meta.dirname, part, answer)
	return answer
}
