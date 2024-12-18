Oh boy this really sucked.

I was on the right track pretty early, looking for patterns in the value of A encoded in 3 bits. I even found values that could get the first 10 or more digits from either end of the program. But I was really doomed the whole time, because my program was screwing up bit operations when the numbers were too large.

1. `^` (XOR) operations had to be followed by a `<<< 0`
2. `<< 3` had to be replaced with `* 8`

A couple (more) hard lessons to learn about Javascript's numbers.
