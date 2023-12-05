// Create a new year/day folder if it doesn't already exist and start a test watcher

import fs from 'node:fs'
import path from 'node:path'

function exitWithError(error: string) {
	console.error(error)
	process.exit(1)
}

const [dayOrYearArg, dayArg] = process.argv.slice(2)
if (!dayOrYearArg) exitWithError('Missing day number')

let year: number
let day: number

if (!dayArg) {
	year = new Date().getFullYear()
	day = parseInt(dayOrYearArg)
} else {
	year = parseInt(dayOrYearArg)
	day = parseInt(dayArg)
}
if (isNaN(day) || day < 1 || day > 25) exitWithError('Invalid day number')
if (isNaN(year) || year < 2015) exitWithError('Invalid year number')

const dayPadded = `${day}`.padStart(2, '0')
const dayPath = path.join(`${year}`, dayPadded)

try {
	// Create folder if it doesn't exist yet and copy files
	const createdDir = fs.mkdirSync(dayPath, { recursive: true })
	if (createdDir) {
		console.log('Created directory', dayPath)
		const glob = new Bun.Glob('*')
		for await (const fileName of glob.scan({ cwd: 'template' })) {
			console.log('Copying', fileName, 'to', dayPath)
			const file = Bun.file(path.join('template', fileName))
			await Bun.write(path.join(dayPath, fileName), file)
		}
	}
} catch (_) {}

Bun.spawn(['bun', 'test', '--watch', dayPath], {
	stdio: ['inherit', 'inherit', 'inherit'], // Forward console logs
})
