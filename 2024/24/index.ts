const parseInput = (input: string) => {
	const [wiresStr, gatesStr] = input.trim().split('\n\n')
	const wireValues: Map<string, 0 | 1 | null> = new Map(
		wiresStr.split('\n').map((line) => {
			const [wireName, valueStr] = line.split(': ')
			return [wireName, +valueStr as 0 | 1]
		})
	)
	const gates = gatesStr.split('\n').map((line) => {
		const [gateStr, output] = line.split(' -> ')
		let [input1, operation, input2] = gateStr.split(' ')
		if (input1.startsWith('y')) {
			const input1temp = input1
			input1 = input2
			input2 = input1temp
		}
		if (!wireValues.has(input1)) wireValues.set(input1, null)
		if (!wireValues.has(input2)) wireValues.set(input2, null)
		if (!wireValues.has(output)) wireValues.set(output, null)
		return {
			input1,
			input2,
			operation,
			output,
		} as Gate
	})
	return { wireValues, gates }
}

const doOperation = (op: Gate['operation'], input1: 0 | 1, input2: 0 | 1): 0 | 1 => {
	switch (op) {
		case 'AND':
			return (input1 & input2) as 0 | 1
		case 'OR':
			return (input1 | input2) as 0 | 1
		case 'XOR':
			return (input1 ^ input2) as 0 | 1
	}
}

export const getPart1Answer: Answer = (input, example = false) => {
	const { wireValues, gates } = parseInput(input)
	evaluateWires(gates, wireValues)
	const zValue = getNumberFromXYZ('z', wireValues)
	return zValue
}

export const part1Examples: Example[] = [
	[
		`x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`,
		'4',
	],
	[
		`x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`,
		'2024',
	],
]

type Gate = {
	input1: string
	input2: string
	operation: 'AND' | 'OR' | 'XOR'
	output: string
	zGate?: string[]
	value?: 0 | 1
}

const getNumberFromXYZ = (
	letter: 'x' | 'y' | 'z',
	wireValues: Map<string, 0 | 1 | null>
) => {
	let binaryString = ''
	for (let i = 0; i < 100; i++) {
		const value = wireValues.get(`${letter}${i.toString().padStart(2, '0')}`)
		if (value === undefined) break
		if (value === null) throw `null ${letter} ${i}`
		binaryString = value + binaryString
	}
	return parseInt(binaryString, 2)
}

const cloneGates = (gates: Gate[]) =>
	gates.map((gate) => ({ ...gate, zGate: undefined, value: undefined }))
const cloneWires = (wireValues: Map<string, 0 | 1 | null>) =>
	new Map([...wireValues].map((wv) => [...wv]))
const zeroWires = (wireValues: Map<string, 0 | 1 | null>) =>
	new Map(
		[...wireValues].map(([w, v]) => [w, w.startsWith('x') || w.startsWith('y') ? 0 : v])
	)

const evaluateWires = (gates: Gate[], wireValues: Map<string, 0 | 1 | null>) => {
	const stack = [...gates]
	let lastStackSize = 0
	let staticStackSizeDuration = 0
	while (stack.length > 0) {
		if (stack.length === lastStackSize) staticStackSizeDuration++
		else staticStackSizeDuration = 0
		if (staticStackSizeDuration === stack.length) throw 'loop!'
		lastStackSize = stack.length
		const gate = stack.pop()!
		const input1Value = wireValues.get(gate.input1)!
		const input2Value = wireValues.get(gate.input2)!
		if (input1Value === null || input2Value === null) {
			stack.unshift(gate)
			continue
		}
		const value = doOperation(gate.operation, input1Value, input2Value)
		wireValues.set(gate.output, value)
		gate.value = value
	}
}

const formatBinary = (number: number | bigint) =>
	number
		.toString(2)
		.padStart(zGateCount + 1, '0')
		.replaceAll('0', ' 0')
		.replaceAll('1', ' 1')

let zGateCount = 0

export const getPart2Answer: Answer = (input, example = false) => {
	if (example) return 0
	const { wireValues, gates } = parseInput(input)
	zGateCount = gates.filter((g) => g.output.startsWith('z')).length
	const initWireValues = cloneWires(wireValues)
	const zeroedWires = zeroWires(initWireValues)
	const numberLine = new Array(47).fill(0).map((_, i) => (46 - i).toString().padStart(2))
	// sorted gate list
	console.log(
		gates
			.map((g) => `${g.output} <- ${g.input1} ${g.operation.padStart(3)} ${g.input2}`)
			.sort((a, b) => {
				const aStr = a.startsWith('z') ? a : a.substring(6)
				const bStr = b.startsWith('z') ? b : b.substring(6)
				return aStr < bStr ? 1 : -1
			})
			.join('\n')
	)
	for (let x = -1; x <= 44; x++) {
		for (let y = 0; y <= 0 /*44*/; y++) {
			const modifiedWires = cloneWires(zeroedWires)
			if (x >= 0) modifiedWires.set(`x${x.toString().padStart(2, '0')}`, 1)

			for (let y = 0; y <= 44; y++) {
				modifiedWires.set(`y${y.toString().padStart(2, '0')}`, 1)
			}
			evaluateWires(gates, modifiedWires)
			const xValue = getNumberFromXYZ('x', modifiedWires)
			const yValue = getNumberFromXYZ('y', modifiedWires)
			const zValue = getNumberFromXYZ('z', modifiedWires)
			const sum = xValue + yValue
			console.log('          ', numberLine.join(''))
			console.log('          ', numberLine.map(() => ' |').join(''))
			console.log(
				x.toString().padStart(2),
				y.toString().padStart(2),
				'x:  ',
				formatBinary(xValue)
			)
			console.log(
				x.toString().padStart(2),
				y.toString().padStart(2),
				'y:  ',
				formatBinary(yValue)
			)
			console.log(
				x.toString().padStart(2),
				y.toString().padStart(2),
				'sum:',
				formatBinary(sum)
			)
			console.log(
				x.toString().padStart(2),
				y.toString().padStart(2),
				'z:  ',
				formatBinary(zValue)
			)
			const diff = BigInt(sum) ^ BigInt(zValue)
			console.log(
				x.toString().padStart(2),
				y.toString().padStart(2),
				'dif:',
				formatBinary(diff).replaceAll('0', ' ')
			)
		}
	}
	const potentialPairs: Set<string> = new Set()
	for (const gate1 of gates) {
		const gate1InputOf = gates.filter(
			(g) => g.input1 === gate1.output || g.input2 === gate1.output
		)
		for (const gate2 of gates) {
			if (gate2 === gate1) continue
			if (
				gate2.input1 === gate1.output ||
				gate2.input2 === gate1.output ||
				gate1.input1 === gate2.output ||
				gate1.input2 === gate2.output
			)
				continue
			const pairKey = [gate1.output, gate2.output].sort().join(',')
			if (potentialPairs.has(pairKey)) continue
			const gate2InputOf = gates.filter(
				(g) => g.input1 === gate2.output || g.input2 === gate2.output
			)
			if (
				gate1InputOf.length !== 1 ||
				gate2InputOf.length !== 1 ||
				gate1InputOf[0] !== gate2InputOf[0]
			) {
				potentialPairs.add(pairKey)
			}
		}
	}
	console.log('potential pair count:', potentialPairs.size)
	const goodPairs: string[] = []
	for (const pair of potentialPairs) {
		const modifiedGates = cloneGates(gates)
		const [gate1out, gate2out] = pair.split(',')
		const gate1 = modifiedGates.find((g) => g.output === gate1out)!
		const gate2 = modifiedGates.find((g) => g.output === gate2out)!
		gate1.output = gate2out
		gate2.output = gate1out
		const modifiedWires = cloneWires(initWireValues)
		try {
			evaluateWires(modifiedGates, modifiedWires)
		} catch (e) {
			continue
		}
		goodPairs.push(pair)
	}
	console.log('good pairs:', goodPairs.length)
	const p1Pairs = goodPairs.filter((p) => {
		const z10 = p.includes('z10') && !p.includes('z17') && !p.includes('z39')
		if (!z10) return false
		const otherGate = gates.find(
			(g) => g.output === p.split(',').filter((g) => g !== 'z10')[0]
		)!
		if (otherGate.operation !== 'XOR') return false
		return true
	})
	console.log('p1 pairs:', p1Pairs.length)
	const p2Pairs = goodPairs.filter((p) => {
		const z17 = p.includes('z17') && !p.includes('z10') && !p.includes('z39')
		if (!z17) return false
		const otherGate = gates.find(
			(g) => g.output === p.split(',').filter((g) => g !== 'z17')[0]
		)!
		if (otherGate.operation !== 'XOR') return false
		return true
	})
	console.log('p2 pairs:', p2Pairs.length)
	const p3Pairs = goodPairs.filter((p) => {
		const z39 = p.includes('z39') && !p.includes('z10') && !p.includes('z17')
		if (!z39) return false
		const otherGate = gates.find(
			(g) => g.output === p.split(',').filter((g) => g !== 'z39')[0]
		)!
		if (otherGate.operation !== 'XOR') return false
		return true
	})
	console.log('p3 pairs:', p3Pairs.length)
	const p4pairs = ['dvb,fsq'] // hell yeah
	console.log('p4 pairs:', p4pairs.length)

	const y1wires = cloneWires(zeroedWires)
	for (let y = 0; y <= 44; y++) {
		y1wires.set(`y${y.toString().padStart(2, '0')}`, 1)
	}
	const totalTestCount = p1Pairs.length * p2Pairs.length * p3Pairs.length * p4pairs.length
	console.log('total tests', totalTestCount)
	const triedTestKeys: Set<string> = new Set()
	for (const pair1 of p1Pairs) {
		const p1g1 = pair1.substring(0, 3)
		const p1g2 = pair1.substring(4)
		console.log(((triedTestKeys.size / totalTestCount) * 100).toFixed(4), '%')
		for (const pair2 of p2Pairs) {
			if (pair2 === pair1) continue
			const p2g1 = pair2.substring(0, 3)
			const p2g2 = pair2.substring(4)
			if ([p1g1, p1g2].includes(p2g1) || [p1g1, p1g2].includes(p2g2)) continue
			for (const pair3 of p3Pairs) {
				if (pair3 === pair1 || pair3 === pair2) continue
				const p3g1 = pair3.substring(0, 3)
				const p3g2 = pair3.substring(4)
				if (
					[p1g1, p1g2, p2g1, p2g2].includes(p3g1) ||
					[p1g1, p1g2, p2g1, p2g2].includes(p3g2)
				)
					continue
				for (const pair4 of p4pairs) {
					if (pair4 === pair1 || pair4 === pair2 || pair4 === pair3) continue
					const p4g1 = pair4.substring(0, 3)
					const p4g2 = pair4.substring(4)
					if (
						[p1g1, p1g2, p2g1, p2g2, p3g1, p3g2].includes(p4g1) ||
						[p1g1, p1g2, p2g1, p2g2, p3g1, p3g2].includes(p4g2)
					)
						continue
					const testKey = [pair1, pair2, pair3, pair4].sort().join(',')
					if (triedTestKeys.has(testKey)) continue
					triedTestKeys.add(testKey)
					const modifiedGates = cloneGates(gates)
					const p1gate1 = modifiedGates.find((g) => g.output === p1g1)!
					const p1gate2 = modifiedGates.find((g) => g.output === p1g2)!
					p1gate1.output = p1g2
					p1gate2.output = p1g1
					const p2gate1 = modifiedGates.find((g) => g.output === p2g1)!
					const p2gate2 = modifiedGates.find((g) => g.output === p2g2)!
					p2gate1.output = p2g2
					p2gate2.output = p2g1
					const p3gate1 = modifiedGates.find((g) => g.output === p3g1)!
					const p3gate2 = modifiedGates.find((g) => g.output === p3g2)!
					p3gate1.output = p3g2
					p3gate2.output = p3g1
					const p4gate1 = modifiedGates.find((g) => g.output === p4g1)!
					const p4gate2 = modifiedGates.find((g) => g.output === p4g2)!
					p4gate1.output = p4g2
					p4gate2.output = p4g1
					let badSwaps = false
					for (let x = 0; x <= 44; x++) {
						if (badSwaps) break
						const testWires = cloneWires(y1wires)
						testWires.set(`x${x.toString().padStart(2, '0')}`, 1)
						const xValue = getNumberFromXYZ('x', testWires)
						const yValue = getNumberFromXYZ('y', testWires)
						const sum = xValue + yValue
						try {
							evaluateWires(modifiedGates, testWires)
						} catch (e) {
							badSwaps = true
							continue
						}
						const modifiedZ = getNumberFromXYZ('z', testWires)
						if (modifiedZ !== sum) {
							badSwaps = true
						}
					}
					if (!badSwaps)
						return [p1g1, p1g2, p2g1, p2g2, p3g1, p3g2, p4g1, p4g2].sort().join(',')
				}
			}
		}
	}
	throw 'no solution found'
}

export const part2Examples: Example[] = [
	[
		`x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00`,
		'z00,z01,z02,z05',
	],
]
