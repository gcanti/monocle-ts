import { fromTraversable } from '../src'
import { array } from 'fp-ts/lib/Array'

const eachL = fromTraversable(array)<number>()

const xs = [1, 2, 3, 4]

console.log(eachL.set(0)(xs)) // => [ 0, 0, 0, 0 ]

console.log(eachL.modify((n: number) => n + 1)(xs)) // => [ 2, 3, 4, 5 ]

const fold = eachL.asFold()

console.log(fold.getAll(xs))
console.log(fold.headOption(xs))
console.log(fold.find(n => n > 2)(xs))
console.log(fold.all((n: number) => n % 2 === 0)(xs))
