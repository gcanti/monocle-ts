import * as P from '../../src/Prism'
import { pipe } from 'fp-ts/function'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(P.id<A>(), P.props())
// $ExpectError
pipe(P.id<A>(), P.props('a'))

pipe(P.id<A>(), P.props('a', 'b')) // $ExpectType Optional<A, { a: string; b: number; }>
