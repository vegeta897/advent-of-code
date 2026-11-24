// Create a new year/day folder if it doesn't already exist and start a test watcher

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

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

// Create folder if it doesn't exist yet and copy files
try {
	await fs.readdir(dayPath)
} catch (_) {
	console.log('Creating folder', dayPath)
	await fs.mkdir(dayPath, { recursive: true })
	for await (const fileName of fs.glob('**/*.*', { cwd: 'template' })) {
		console.log('Copying', fileName, 'to', dayPath)
		await fs.copyFile(path.join('template', fileName), path.join(dayPath, fileName))
	}
}

spawn(`node`, ['--test', '--watch', `${dayPath}/index.test.ts`], {
	stdio: 'inherit', // Forward console logs
})
