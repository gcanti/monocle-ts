import * as P from '../../src/Prism'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

declare const prismC: P.Prism<A, A['c']>

//
// modifyOption
//

// $ExpectType (s: A) => Option<A>
pipe(prismC, P.modifyOption((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => Option<A>
pipe(prismC, P.modifyOption<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => Option<A>
pipe(prismC, P.modifyOption(() => 'foo'))

//
// modify
//

// $ExpectType (s: A) => A
pipe(prismC, P.modify((
  a // $ExpectType string | boolean
) => a))

// $ExpectType (s: A) => A
pipe(prismC, P.modify<string | boolean>(() => 'foo'))

// $ExpectType (s: A) => A
pipe(prismC, P.modify(() => 'foo'))

//
// props
//

// $ExpectError
pipe(P.id<A>(), P.pick())
// $ExpectError
pipe(P.id<A>(), P.pick('a'))

pipe(P.id<A>(), P.pick('a', 'b')) // $ExpectType Optional<A, { a: string; b: number; }>
