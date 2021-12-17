/**
 * @since 2.4.0
 */
import { fst, snd, map, mapLeft } from 'fp-ts/lib/Tuple'
import { constant } from 'fp-ts/lib/function'
import { Lens } from '.'

// TODO on fp-ts upgrade: map → mapFst
const one = new Lens<[any, any], any>(fst, (x) => map(constant(x)))

/**
 * @category constructor
 * @since 2.4.0
 */
export const _1 = <A, B>(): Lens<[A, B], A> => one

// TODO on fp-ts upgrade: mapLeft → mapSnd
const two = new Lens<[any, any], any>(snd, (y) => mapLeft(constant(y)))

/**
 * @category constructor
 * @since 2.4.0
 */
export const _2 = <A, B>(): Lens<[A, B], B> => two
