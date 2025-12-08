type XYZ = [x: number, y: number, z: number]

const getDistanceSquared = (a: XYZ, b: XYZ) => {
	const [ax, ay, az] = a
	const [bx, by, bz] = b
	return (bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2
}

const parseInput = (input: string) => {
	return input
		.trim()
		.split('\n')
		.map((line) => line.split(',').map((v) => +v) as XYZ)
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	const parsed = parseInput(input)
	const connectionMax = example ? 10 : 1000
	const connections: Set<string> = new Set()
	const possibleConnections: { a: number; b: number; distance: number }[] = []
	const aToB: number[][] = []
	for (let i = 0; i < parsed.length; i++) {
		for (let j = 0; j < parsed.length; j++) {
			if (i === j) continue
			const a = i < j ? i : j
			const b = i < j ? j : i
			if (aToB[a]) {
				if (aToB[a].includes(b)) continue
				aToB[a].push(b)
			} else {
				aToB[a] = [b]
			}
			possibleConnections.push({
				a,
				b,
				distance: getDistanceSquared(parsed[a], parsed[b]),
			})
		}
	}
	possibleConnections.sort((a, b) => a.distance - b.distance)
	let circuits: number[] = []
	for (let c = 0; c < connectionMax; c++) {
		const connection = [possibleConnections[c].a, possibleConnections[c].b]
		connections.add(connection.join('-'))
		const existingCircuitA = circuits[connection[0]]
		const existingCircuitB = circuits[connection[1]]
		if (existingCircuitA >= 0) {
			circuits = circuits.map((circuit) => (circuit === existingCircuitA ? c : circuit))
		} else {
			circuits[connection[0]] = c
		}
		if (existingCircuitB >= 0) {
			circuits = circuits.map((circuit) => (circuit === existingCircuitB ? c : circuit))
		} else {
			circuits[connection[1]] = c
		}
	}
	let circuitCounts: number[] = []
	for (let i = 0; i < connectionMax; i++) {
		const count = circuits.filter((c) => c === i).length
		if (count > 0) circuitCounts.push(count)
	}
	circuitCounts.sort((a, b) => b - a)
	return circuitCounts[0] * circuitCounts[1] * circuitCounts[2]
}

export const part1Examples: Example[] = [
	[
		`162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
		'40',
	],
]

export const getPart2Answer: Answer = (input, example = false) => {
	const parsed = parseInput(input)
	const possibleConnections: { a: number; b: number; distance: number }[] = []
	const aToB: number[][] = []
	for (let i = 0; i < parsed.length; i++) {
		for (let j = 0; j < parsed.length; j++) {
			if (i === j) continue
			const a = i < j ? i : j
			const b = i < j ? j : i
			if (aToB[a]) {
				if (aToB[a].includes(b)) continue
				aToB[a].push(b)
			} else {
				aToB[a] = [b]
			}
			possibleConnections.push({
				a,
				b,
				distance: getDistanceSquared(parsed[a], parsed[b]),
			})
		}
	}
	possibleConnections.sort((a, b) => b.distance - a.distance)
	let circuitsByBox: number[] = parsed.map(() => 0)
	let circuit = 1
	while (true) {
		const connection = possibleConnections.pop()!
		let allConnected = true
		const existingCircuits = new Set()
		if (circuitsByBox[connection.a]) existingCircuits.add(circuitsByBox[connection.a])
		if (circuitsByBox[connection.b]) existingCircuits.add(circuitsByBox[connection.b])
		for (let c = 0; c < circuitsByBox.length; c++) {
			if (
				c === connection.a ||
				c === connection.b ||
				existingCircuits.has(circuitsByBox[c])
			) {
				circuitsByBox[c] = circuit
			} else {
				allConnected = false
			}
		}
		if (allConnected) return parsed[connection.a][0] * parsed[connection.b][0]
		circuit++
	}
}

export const part2Examples: Example[] = [[part1Examples[0][0], '25272']]
