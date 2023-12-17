A bit frustrated with myself. I abandoned the A\* approach right away because of the movement restrictions. I spent hours working on a recursive DFS with some hacky optimizations and a hash map that keyed on position, straight moves, and last direction. And still, it just wouldn't stop running.

Something felt wrong, because the total possible hashes was not that large of a number, so it seemed wrong that it should take so long. I must have been doing something very redundant to cause so many iterations.

I finally decided to try A\* again, and it turns out all I had to do was use that same hashing I was using before instead of just an X:Y hash. I struggled to grok why it worked, or rather why it was so much faster, but boy was it.

Rank #2884
