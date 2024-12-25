Another doozy. This one, I don't even want to try to solve with pure programming. Not gonna clean up either.

I needed my pen and paper to understand what was going on here. Using a graph library that would spit this all out automatically would have been really nice, but I don't know how to do that.

Identifying the 3 wrong `z` gates, and then the one pair of gates involved in a particular digit that was wrong, gave me a brute-force-able number of pair sets to try. I didn't have much hope that it would actually work, but it totally did.

I'm including notes that I wrote here:

```txt
Any 2 gates that are _only_ inputs of one gate do NOT need to swap
Any 2 gates with the same output value do NOT need to swap
Any 2 gates whose output is the input of the other can NOT swap, infinite loop
Wrong, because another swap might change one of their outputs

Every gate shares a z with a gate that shares another z, there are no discrete clusters

x and y wires are always paired with the same digit in inputs

some x's and y's appear in multiple inputs

study the operations done on these x/y inputs

find out which digit z10 should swap with, look at outputs of all 45x45 results

look at what the old single-input code found for answers, look for most common gates among these

89 ANDs, 89 XORs, 44 ORs

All z outputs except 45 should be a XOR, these are not: z10 z17 z39

Each x/y should eventually lead to its corresponding (with XOR) z and +1 z (with AND)
```
