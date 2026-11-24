# Advent of Code ⭐

This repo contains my solutions for Advent of Code 2023 and onward.

[2022 repo](https://github.com/vegeta897/aoc2022)

## How to use

To solve a new day, run `npm run day {day}` or `npm run day {year} {day}`. If the year is omitted, the current year will be used. If the day folder doesn't already exist, the contents of `template` will be copied into it.

The test runner will then begin, in watch mode. Copy your puzzle input into `input.txt`, and (un)comment lines in `index.test.ts` as needed.

Answers will be logged to `answers.log` in the day folder, for your own reference. Duplicate answers will be ignored.

## TODO

- Allow appending a,b,c to day
- Migrate files in previous years back to Node

_Repo structure inspired by [itswil's template](https://github.com/itswil/advent-of-code/)_
