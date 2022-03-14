import * as O from '../../src/Optional'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(O.id<A>(), O.pick())
// $ExpectError
pipe(O.id<A>(), O.pick('a'))

pipe(O.id<A>(), O.pick('a', 'b')) // $ExpectType Optional<A, { a: string; b: number; }>
