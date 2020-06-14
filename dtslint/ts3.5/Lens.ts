import * as L from '../../src/Lens'
import { pipe } from 'fp-ts/lib/function'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(L.id<A>(), L.props())
// $ExpectError
pipe(L.id<A>(), L.props('a'))

pipe(L.id<A>(), L.props('a', 'b')) // $ExpectType Lens<A, { a: string; b: number; }>
