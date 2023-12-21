More pathfinding but with a nasty twist.

It didn't take me very long to come up with a basic strategy, but implementing it took a lot of work and checking my math on a small blank map with much fewer steps.

My code is quite repetitive, and possibly not flexible for other map sizes or step counts (or maps without empty alleys), but it is written in the way that I broke down the problem.

It runs in just over 3 seconds, which is a tad slower than I'd like, but not slow enough for me to try optimizing right now.

There must be a formula for calculating the diamond shaped area covered by manhattan distances, but calculating it with a for loop takes almost no time.

Rank #1765
