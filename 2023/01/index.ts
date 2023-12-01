const parseInput = (input: string) => input.trim().split('\n')

export const getPart1Answer: Answer = (input) => {
	const parsed = parseInput(input)
	let sum = 0
	for (const line of parsed) {
		const digits = line.split('').filter((c) => !isNaN(+c))
		const first = +digits[0]
		const last = +digits[digits.length - 1]
		sum += first * 10 + last
	}
	return sum
}

export const part1Examples: Example[] = [
	[
		`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
		142,
	],
]

const writtenDigits = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
}
const digits = [...Object.entries(writtenDigits).flat()]
const getDigitValue = (digit: number | string) =>
	typeof digit === 'string' ? writtenDigits[digit as keyof typeof writtenDigits] : digit

export const getPart2Answer: Answer = (input) => {
	const parsed = parseInput(input)
	let sum = 0
	for (const line of parsed) {
		let firstDigit: number
		let firstDigitIndex = Infinity
		digits.forEach((d) => {
			const digitIndex = line.indexOf(d.toString())
			if (digitIndex >= 0 && digitIndex < firstDigitIndex) {
				firstDigitIndex = digitIndex
				firstDigit = getDigitValue(d)
			}
		})
		let lastDigit: number
		let lastDigitIndex = -1
		digits.forEach((d) => {
			const digitIndex = line.lastIndexOf(d.toString())
			if (digitIndex >= 0 && digitIndex > lastDigitIndex) {
				lastDigitIndex = digitIndex
				lastDigit = getDigitValue(d)
			}
		})
		sum += firstDigit! * 10 + lastDigit!
	}
	return sum
}

export const part2Examples: Example[] = [
	[
		`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
		281,
	],
]
