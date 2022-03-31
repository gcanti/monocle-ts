import * as T from '../../src/Traversal'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

declare const traversalC: T.Traversal<A, A['c']>

//
// modify
//

// $ExpectType (s: A) => A
pipe(traversalC, T.modify((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => A
pipe(traversalC, T.modify<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => A
pipe(traversalC, T.modify(() => 'foo'))

// $ExpectError
pipe(T.id<A>(), T.props())
// $ExpectError
pipe(T.id<A>(), T.props('a'))

pipe(T.id<A>(), T.props('a', 'b')) // $ExpectType Traversal<A, { a: string; b: number; }>
