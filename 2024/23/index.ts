const parseInput = (input: string) => {
	const connectionMap: Map<string, Set<string>> = new Map()
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [pc1, pc2] = line.split('-') as [string, string]
			const connectedTo1 = connectionMap.get(pc1) || new Set()
			connectedTo1.add(pc2)
			connectionMap.set(pc1, connectedTo1)
			const connectedTo2 = connectionMap.get(pc2) || new Set()
			connectedTo2.add(pc1)
			connectionMap.set(pc2, connectedTo2)
		})
	return connectionMap
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const connectionMap = parseInput(input)
	const triplets: Set<string> = new Set()
	for (const [pc1, pc1Connections] of connectionMap) {
		for (const pc2 of pc1Connections) {
			const pc2Connections = connectionMap.get(pc2)!
			const commonSet = pc2Connections.intersection(pc1Connections)
			for (const common of commonSet) {
				const triplet = [pc1, pc2, common]
				if (triplet.length === 3 && triplet.some((pc) => pc.startsWith('t'))) {
					triplet.sort()
					triplets.add(triplet.join(','))
				}
			}
		}
	}
	return triplets.size
}

export const part1Examples: Example[] = [
	[
		`kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
		'7',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const connectionMap = parseInput(input)
	let largest: string[] = []
	for (const [pc1, pc1Connections] of connectionMap) {
		for (const pc2 of pc1Connections) {
			const pc2Connections = connectionMap.get(pc2)!
			const commonSet = pc2Connections.intersection(pc1Connections)
			const common = [pc1, pc2, ...commonSet].sort()
			let valid = true
			for (const member of common) {
				for (const otherMember of common) {
					if (member === otherMember) continue
					const good = connectionMap.get(member)!.has(otherMember)
					if (!good) {
						valid = false
						break
					}
				}
				if (!valid) break
			}
			if (valid && common.length > largest.length) largest = common
		}
	}
	return largest.join(',')
}

export const part2Examples: Example[] = [[part1Examples[0][0], 'co,de,ka,ta']]
