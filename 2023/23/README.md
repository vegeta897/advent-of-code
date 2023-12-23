Pretty straightforward part 1, and a part 2 that I spent too long not doing what I had to do.

My part 2 runs in 13 seconds and I'm trying to implement caching that improves that time, but so far it just increases it.

I could adapt my part 2 solution to part 1 but I don't feel like it.

Update: Replacing the visited nodes set with an array cut the run time in half. Sets aren't as performant as I thought? Still no cache luck. But I have another idea to try.

Update 2: I tried replacing the node map with circular node references so that we didn't have to look up the node each time we traversed. It brought the runtime right back up. Oh well!

Rank #1977
