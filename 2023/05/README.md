Holy cow, recursive functions (or permutations) on day 5.

Part 1 was straightforward and I'm happy with my #862 rank, which would have been lower if I hadn't struggled with my new `run` code suppressing my console logs.

I started part 2 with a brute force solution, and it didn't take long to realize that wouldn't finish any time soon (though I wonder how long it would take).

I thought I had the strategy down when I was working with a \[start,end] range set and getting the overlap amount for each mapping, but after some time it dawned on me that the range not only could spread over multiple mappings, but also fall outside of the mappings entirely, and each possibility had to be seen to its conclusion. That's when I knew I'd have to bring in recursion.

But it wasn't even that simple, because I had to figure out how to break up my single range into multiple ranges based on how it fell or didn't fall on the mappings. Luckily, I realized that the mappings probably had no gaps in them -- an assumption that would have taken too long to write a test for, but I had to believe in it for the sake of complexity. So all I had to do was get the mappings that did have overlap, and then also check to see if the range extended beyond (or before) the whole map. Then test each range, and get the lowest result!

So I did worse on part 2, compared to the global rankings. I got #3349. Still, I'm glad my recursion skills are still sharp, I'm sure I'll need them again soon.
