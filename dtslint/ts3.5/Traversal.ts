import * as T from '../../src/Traversal'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: boolean
}

// $ExpectError
pipe(T.id<A>(), T.pick())
// $ExpectError
pipe(T.id<A>(), T.pick('a'))

pipe(T.id<A>(), T.pick('a', 'b')) // $ExpectType Traversal<A, { a: string; b: number; }>
