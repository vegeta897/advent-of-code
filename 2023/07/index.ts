const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [hand, bid] = line.split(' ')
			return { cards: hand.split(''), bid: +bid, score: 0 }
		})

const cardTypes = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const cardTypesP2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

const cardTypeIsHigher = (a: string, b: string, p2 = false) =>
	(p2 ? cardTypesP2 : cardTypes).indexOf(a) < (p2 ? cardTypesP2 : cardTypes).indexOf(b)

function getHandScore(hand: string[]) {
	const handSet = new Set([...hand])
	let highestNumberOfType = 0
	for (let type of [...handSet]) {
		const count = hand.filter((t) => t === type).length
		if (count > highestNumberOfType) highestNumberOfType = count
	}
	switch (handSet.size) {
		case 1:
			return 7 // 5 of a kind
		case 2:
			if (highestNumberOfType === 4) return 6 // 4 of a kind
			return 5 // Full house
		case 3:
			if (highestNumberOfType === 3) return 4 // 3 of a kind
			return 3 // 2 pair
		case 4:
			return 2 // 1 pair
		default:
			return 1 // High card
	}
}

type Hand = { cards: string[]; bid: number; score: number }

function sortHands(hands: Hand[], part2Sorting = false) {
	hands.sort((a, b) => {
		if (a.score === b.score) {
			for (let c = 0; c < 5; c++) {
				if (a.cards[c] === b.cards[c]) continue
				return cardTypeIsHigher(a.cards[c], b.cards[c], part2Sorting) ? 1 : -1
			}
			return 0
		} else {
			return a.score - b.score
		}
	})
}

function getTotalScore(hands: Hand[]) {
	return hands.reduce((a, c, i) => a + c.bid * (i + 1), 0)
}

export const getPart1Answer: Answer = (input: string): string | number => {
	const hands = parseInput(input)
	for (const hand of hands) {
		hand.score = getHandScore(hand.cards)
	}
	sortHands(hands)
	return getTotalScore(hands)
}

export const part1Examples: Example[] = [
	[
		`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
		'6440',
	],
]

export const getPart2Answer: Answer = (input: string): string | number => {
	const hands = parseInput(input)
	const allButJ = cardTypesP2.slice(0, 12)
	for (const hand of hands) {
		if (hand.cards.includes('J')) {
			let bestScore = 0
			for (const cardType of allButJ) {
				const newHand = hand.cards.map((c) => (c === 'J' ? cardType : c))
				const score = getHandScore(newHand)
				if (score > bestScore) {
					bestScore = score
				}
			}
			hand.score = bestScore
		} else {
			hand.score = getHandScore(hand.cards)
		}
	}
	sortHands(hands, true)
	return getTotalScore(hands)
}

export const part2Examples: Example[] = [[part1Examples[0][0], '5905']]
