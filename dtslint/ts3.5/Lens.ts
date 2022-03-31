import * as L from '../../src/Lens'
import { pipe } from 'fp-ts/lib/pipeable'

interface A {
  a: string
  b: number
  c: string | boolean
}

declare const c: A['c']
declare const lensC: L.Lens<A, A['c']>

//
// set
//

// $ExpectType (s: A) => A
pipe(lensC, L.set(c))

// $ExpectType (s: A) => A
pipe(lensC, L.set<string | boolean>('foo'))

// $ExpectType (s: A) => A
pipe(lensC, L.set('foo'))

//
// prop
//

// $ExpectError
pipe(L.id<A>(), L.prop('d'))

//
// props
//

// $ExpectError
pipe(L.id<A>(), L.props())
// $ExpectError
pipe(L.id<A>(), L.props('a'))

pipe(L.id<A>(), L.props('a', 'b')) // $ExpectType Lens<A, { a: string; b: number; }>

//
// component
//

// $ExpectError
pipe(L.id<{ 1: number }>(), L.component(1))
