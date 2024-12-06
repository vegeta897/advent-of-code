Part 1 was easy enough, but I got really stuck on part 2 because I did not consider a situation that doesn't happen in the example, which is that the guard may turn more than once in a single move.

I ultimately decided to use a panic number to detect loops instead of storing visited grids with directions, because it's just way faster. Looking up those strings is surprisingly expensive!
