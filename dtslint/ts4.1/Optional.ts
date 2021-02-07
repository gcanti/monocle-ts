import * as O from '../../src/Optional'
import { pipe } from 'fp-ts/function'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(O.id<A>(), O.props())
// $ExpectError
pipe(O.id<A>(), O.props('a'))

pipe(O.id<A>(), O.props('a', 'b')) // $ExpectType Optional<A, { a: string; b: number; }>
