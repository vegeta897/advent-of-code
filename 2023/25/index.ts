const parseInput = (input: string) =>
	input
		.trim()
		.split('\n')
		.map((line) => {
			const [from, to] = line.split(': ')
			return { from, to: to.split(' ') }
		})

export const getPart1Answer: Answer = (input: string): string | number => {
	const parsed = parseInput(input)
	const components: Set<string> = new Set()
	const connections: Map<string, Set<string>> = new Map()
	const wires: Set<string> = new Set()
	for (const group of parsed) {
		components.add(group.from)
		const connectedSet = connections.get(group.from) || new Set()
		group.to.forEach((t) => connectedSet.add(t))
		connections.set(group.from, connectedSet)
		for (const to of group.to) {
			components.add(to)
			const connectedSet = connections.get(to) || new Set()
			connectedSet.add(group.from)
			connections.set(to, connectedSet)
			wires.add([group.from, to].sort().join('/'))
		}
	}
	function getGroup(origin: string, cuts: [string, string][]) {
		const group: Set<string> = new Set()
		const toCheck: Set<string> = new Set([origin])
		while (toCheck.size > 0 && group.size < components.size) {
			const [checking] = toCheck
			toCheck.delete(checking)
			group.add(checking)
			connections.get(checking)?.forEach((t) => {
				if (
					group.has(t) ||
					cuts.some(
						([c1, c2]) => (c1 === checking && c2 === t) || (c1 === t && c2 === checking)
					)
				)
					return
				toCheck.add(t)
			})
		}
		return group
	}
	type PathNode = {
		component: string
		dist: number
		parent: null | PathNode
	}

	const pathCache: Map<string, string[]> = new Map()

	function findWirePath(start: string, end: string) {
		const cacheKey = start < end ? `${start}>${end}` : `${end}>${start}`
		if (pathCache.has(cacheKey)) return pathCache.get(cacheKey)
		let current: PathNode = {
			component: start,
			dist: 0,
			parent: null,
		}
		const openNodes: Map<string, PathNode> = new Map([[start, current]])
		const closedNodes: Map<string, PathNode> = new Map()
		while (openNodes.size > 0) {
			closedNodes.set(current.component, current)
			openNodes.delete(current.component)
			if (current.component === end) {
				const path = constructPath(start, current)
				for (let i = 0; i < path.length - 1; i++) {
					const from = path[i]
					const cacheKey = from < end ? `${from}>${end}` : `${end}>${from}`
					pathCache.set(cacheKey, path.slice(i))
				}
				return path
			}
			const connectedTo = connections.get(current.component)!
			for (const connected of connectedTo) {
				if (closedNodes.has(connected)) continue
				const nextNode: PathNode = {
					parent: current,
					component: connected,
					dist: current.dist + 1,
				}
				const existing = openNodes.get(current.component)
				if (existing) {
					if (nextNode.dist < existing.dist) {
						existing.dist = nextNode.dist
						existing.parent = current
					}
				} else {
					openNodes.set(connected, nextNode)
				}
			}
			current = getBestNextNode(openNodes)
		}
		throw 'no path found'
	}

	function getBestNextNode(nodes: Map<string, PathNode>) {
		let best: PathNode | undefined
		for (const [, value] of nodes) {
			if (!best || value.dist < best.dist) {
				best = value
			}
		}
		return best as PathNode
	}

	function constructPath(start: string, end: PathNode) {
		const path = []
		let current = end
		let panic = 10000
		while (panic > 0) {
			panic--
			path.push(current.component)
			if (current.component === start) break
			current = current.parent!
		}
		return path.reverse()
	}

	const wireKeys = [...wires]
	const wireUsage: Map<string, number> = new Map(wireKeys.map((w) => [w, 0]))
	const tested: Set<string> = new Set()
	const [fromComponent] = components
	for (const toComponent of components) {
		if (toComponent === fromComponent) continue
		const startComponent: string =
			fromComponent < toComponent ? fromComponent : toComponent
		const endComponent = startComponent === fromComponent ? toComponent : fromComponent
		const pairKey = `${startComponent}:${endComponent}`
		if (tested.has(pairKey)) continue
		tested.add(pairKey)
		const path = findWirePath(startComponent, endComponent)
		if (!path) throw 'no path!'
		for (let i = 1; i < path.length; i++) {
			const from = path[i - 1]
			const to = path[i]
			const wire = from < to ? `${from}/${to}` : `${to}/${from}`
			wireUsage.set(wire, wireUsage.get(wire)! + 1)
		}
	}
	const mostUsedWires = [...wireUsage]
		.sort((a, b) => b[1] - a[1])
		.map(([w]) => w)
		.slice(0, 40)
	const wireKeysArray = mostUsedWires.map((w) => w)
	const wiresArray = mostUsedWires.map((w) => w.split('/') as [string, string])
	const triedCuts: Set<string> = new Set()
	for (let i = 0; i < wireKeysArray.length; i++) {
		const cut1Key = wireKeysArray[i]
		const cut1Wires = wiresArray[i]
		for (let j = i + 1; j < wireKeysArray.length; j++) {
			if (j === i) continue
			const cut2Key = wireKeysArray[j]
			const cut2Wires = wiresArray[j]
			for (let k = j + 1; k < wireKeysArray.length; k++) {
				if (k === j || k === i) continue
				const cut3Key = wireKeysArray[k]
				const cutsKey = [cut1Key, cut2Key, cut3Key].sort().join('-')
				if (triedCuts.has(cutsKey)) continue
				triedCuts.add(cutsKey)
				const cut3Wires = wiresArray[k]
				const group1 = getGroup(cut1Wires[0], [cut1Wires, cut2Wires, cut3Wires])
				if (group1.size === components.size) continue
				const group2 = getGroup(cut1Wires[1], [cut1Wires, cut2Wires, cut3Wires])
				if (group1.size + group2.size === components.size) {
					return group1.size * group2.size
				}
			}
		}
	}
	throw 'no solution found'
}

export const part1Examples: Example[] = [
	[
		`jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`,
		'54',
	],
]
