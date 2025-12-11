const parseInput = (input: string) => {
	const serverMap: Map<string, string[]> = new Map()
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [server, outputString] = line.split(': ')
			const outputs = outputString.split(' ')
			serverMap.set(server, outputs)
		})
	return serverMap
}

function goto(map: Map<string, string[]>, to: string) {
	const outs = map.get(to)!
	let paths = 0
	for (const out of outs) {
		if (out === 'out') return 1
		const result = goto(map, out)
		paths += result
	}
	return paths
}

export const getPart1Answer: Answer = (input, example = false) => {
	// if(!example) return 0
	const serverMap = parseInput(input)
	const paths = goto(serverMap, 'you')
	return paths
}

export const part1Examples: Example[] = [
	[
		`aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
		'5',
	],
]

const parseInput2 = (input: string) => {
	const serverMap: Map<string, Map<string, number>> = new Map()
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [server, outputString] = line.split(': ')
			const outputs = outputString.split(' ')
			const outputMap: Map<string, number> = new Map()
			for (const output of outputs) {
				outputMap.set(output, 1)
			}
			serverMap.set(server, outputMap)
		})
	return serverMap
}

function simplifyMap(map: Map<string, Map<string, number>>) {
	const newMap: Map<string, Map<string, number>> = new Map()
	let simpler = false
	for (const [from, to] of map) {
		const newTo: Map<string, number> = new Map()
		for (const [t, count] of to) {
			if (t === 'out' || t === 'fft' || t === 'dac') {
				newTo.set(t, (newTo.get(t) || 0) + count)
			} else {
				simpler = true
				const tChildren = map.get(t)!
				for (const [child, childCount] of tChildren) {
					newTo.set(child, (newTo.get(child) || 0) + count * childCount)
				}
			}
		}
		newMap.set(from, newTo)
	}
	return { simpler, newMap }
}

function gotoWithDACFFT(
	map: Map<string, Map<string, number>>,
	checkpoints: number,
	to: string,
	incomingCount = 1
) {
	if (to === 'dac') checkpoints += 1
	else if (to === 'fft') checkpoints += 2
	const outs = map.get(to)!
	let paths = 0
	for (const [out, count] of outs) {
		if (out === 'out') {
			if (checkpoints === 3) {
				paths += incomingCount * count
			}
			continue
		}
		const result = gotoWithDACFFT(map, checkpoints, out, incomingCount * count)
		paths += result
	}
	return paths
}

export const getPart2Answer: Answer = (input, example = false) => {
	// if (!example) return 0
	let serverMap = parseInput2(input)
	while (true) {
		const { simpler, newMap } = simplifyMap(serverMap)
		if (!simpler) break
		serverMap = newMap
	}
	const keys = [...serverMap.keys()]
	for (const key of keys) {
		if (key === 'fft' || key === 'dac' || key === 'svr') continue
		if ([...serverMap.values()].some((to) => to.has(key))) continue
		serverMap.delete(key)
	}
	const paths = gotoWithDACFFT(serverMap, 0, 'svr')
	return paths
}

export const part2Examples: Example[] = [
	[
		`svr: aaa bbb
	aaa: fft
	fft: ccc
	bbb: tty
	tty: ccc
	ccc: ddd eee
	ddd: hub
	hub: fff
	eee: dac
	dac: fff
	fff: ggg hhh
	ggg: out
	hhh: out`,
		'2',
	],
	[
		`svr: aaa bbb fft abc
abc: aaa fft
aaa: fft
fft: ccc dac
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
		'16',
	],
]
