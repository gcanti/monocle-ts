import * as L from '../../src/Lens'
import { pipe } from 'fp-ts/function'

interface A {
  a: string
  b: number
  c: boolean
}

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
