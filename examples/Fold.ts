import { Fold, fromFoldable } from '../src'
import { array } from 'fp-ts/lib/Array'
import { monoidProduct, monoidSum } from 'fp-ts/lib/Monoid'
import { identity } from 'fp-ts/lib/function'

const xs = ['a', 'bb']
const fold = fromFoldable<string>(array)

console.log(fold.foldMap(monoidSum, s => s.length, xs))
console.log(fold.foldMap(monoidProduct, s => s.length, xs))
