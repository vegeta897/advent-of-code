const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(' ').map((v) => +v))
}

const reportIsValid = (report: number[]) => {
	let direction = 0
	for (let i = 1; i < report.length; i++) {
		const prev = report[i - 1]
		const curr = report[i]
		direction ||= Math.sign(curr - prev)
		if (
			(direction > 0 && curr - prev < 1) ||
			(direction < 0 && curr - prev > -1) ||
			Math.abs(prev - curr) > 3 ||
			Math.abs(prev - curr) < 1
		) {
			return false
		}
	}
	return true
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const reports = parseInput(input)
	const goodReports = reports.filter(reportIsValid)
	return goodReports.length
}

export const part1Examples: Example[] = [
	[
		`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
		'2',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const reports = parseInput(input)
	let goodReportCount = 0
	reports.forEach((report) => {
		if (!reportIsValid(report)) {
			for (let i = 0; i < report.length; i++) {
				const modifiedReport = report.filter((_, li) => li !== i)
				if (reportIsValid(modifiedReport)) {
					goodReportCount++
					return
				}
			}
			return
		}
		goodReportCount++
	})
	return goodReportCount
}

export const part2Examples: Example[] = [
	[
		`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
		'4',
	],
]
