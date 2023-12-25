Well, what a finale. Probably the most difficult day of the year, or the last few years. I say "finale" because the actual final day is traditionally fairly easy.

I had to pull a segment intersection function from SO but I'm okay with that. Part 1 wasn't so bad and I felt good about my logic for getting the segments limited to the designated collision zone.

Part 2 was just a monster. After spending a lot of time trying various brute force strategies, I broke down and looked on reddit for some hints. A lot of people used function solvers but that's beyond my knowledge and I wanted something more program-y. I wanted to fully understand everything my code was doing. I'm happy to say I've met that goal and finally got a working solution. Some bits came from outside inspiration but no code was copied and the core of the logic is all mine.

The big key was creating a list of possible velocities for each axis (thanks reddit). Turns out the input only has one possibility for each (the example has more). With this, I can use hailstones that have one axis matching to get the times at which their paths intersect on the other axes relative to the target velocity. Those times are the actual intersect times, and so I can get the real intersect positions. Working backwards from any one of those with the target velocity gives me the rock's start position.

There's probably a lot of unnecessary checks or other redundant things but I am _so_ done with this code. Day 25 starts in just over an hour.

Rank #6223
