import * as P from '../../src/Prism'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(P.id<A>(), P.pick())
// $ExpectError
pipe(P.id<A>(), P.pick('a'))

pipe(P.id<A>(), P.pick('a', 'b')) // $ExpectType Optional<A, { a: string; b: number; }>
