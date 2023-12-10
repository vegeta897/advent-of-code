export async function logAnswer(path: string, part: 1 | 2, answer: string) {
	if (!answer) return
	let answerLog = await Bun.file(`${path}/answers.log`).text()
	const loggedAnswers = answerLog
		.split('\n')
		.filter((line) => line)
		.map((line) => {
			const [timestamp, part, answer] = line.split(/ [|=] /)
			return { time: new Date(timestamp), part: +part.split(' ')[1], answer }
		})
	if (loggedAnswers.some((logged) => logged.part === part && logged.answer === answer)) {
		return // Already logged
	}
	const now = new Date()
	const timestamp =
		now.toLocaleDateString('en-us', { timeZone: 'EST' }) +
		' ' +
		now.toLocaleTimeString('en-us', { timeZone: 'EST' })
	const logEntry = `${timestamp} | Part ${part} = ${answer}\n`
	Bun.write(`${path}/answers.log`, answerLog + logEntry)
}
