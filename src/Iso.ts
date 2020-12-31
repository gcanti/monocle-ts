/**
 * An `Iso` is an optic which converts elements of type `S` into elements of type `A` without loss.
 *
 * Laws:
 *
 * 1. reverseGet(get(s)) = s
 * 2. get(reversetGet(a)) = a
 *
 * @since 3.0.0
 */
import { Applicative } from 'fp-ts/Applicative'
import { Category2 } from 'fp-ts/Category'
import { flow, identity, pipe } from 'fp-ts/function'
import { HKT } from 'fp-ts/HKT'
import { Invariant2 } from 'fp-ts/Invariant'
import * as O from 'fp-ts/Option'
import * as _ from './internal'
import { Lens } from './Lens'
import { Optional } from './Optional'
import { Prism } from './Prism'
import { Traversal } from './Traversal'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export interface Iso<S, A> {
  readonly get: (s: S) => A
  readonly reverseGet: (a: A) => S
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const id = <S>(): Iso<S, S> => ({
  get: identity,
  reverseGet: identity
})

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View an `Iso` as a `Lens`.
 *
 * @category converters
 * @since 3.0.0
 */
export const asLens: <S, A>(sa: Iso<S, A>) => Lens<S, A> = _.isoAsLens

/**
 * View an `Iso` as a `Prism`.
 *
 * @category converters
 * @since 3.0.0
 */
export const asPrism = <S, A>(sa: Iso<S, A>): Prism<S, A> => ({
  getOption: flow(sa.get, O.some),
  reverseGet: sa.reverseGet
})

/**
 * View an `Iso` as a `Optional`.
 *
 * @category converters
 * @since 3.0.0
 */
export const asOptional: <S, A>(sa: Iso<S, A>) => Optional<S, A> = _.isoAsOptional

/**
 * View an `Iso` as a `Traversal`.
 *
 * @category converters
 * @since 3.0.0
 */
export const asTraversal = <S, A>(sa: Iso<S, A>): Traversal<S, A> => ({
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      f(sa.get(s)),
      F.map((a) => sa.reverseGet(a))
    )
})

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose an `Iso` with an `Iso`.
 *
 * @category compositions
 * @since 3.0.0
 */
export const compose = <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>): Iso<S, B> => ({
  get: flow(sa.get, ab.get),
  reverseGet: flow(ab.reverseGet, sa.reverseGet)
})

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 3.0.0
 */
export const reverse = <S, A>(sa: Iso<S, A>): Iso<A, S> => ({
  get: sa.reverseGet,
  reverseGet: sa.get
})

/**
 * @category combinators
 * @since 3.0.0
 */
export const modify = <A>(f: (a: A) => A) => <S>(sa: Iso<S, A>) => (s: S): S => sa.reverseGet(f(sa.get(s)))

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 3.0.0
 */
export const imap: Invariant2<URI>['imap'] = (f, g) => (ea) => ({
  get: flow(ea.get, f),
  reverseGet: flow(g, ea.reverseGet)
})

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export const URI = 'monocle-ts/Iso'

/**
 * @category instances
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Iso<E, A>
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Invariant: Invariant2<URI> = {
  URI,
  imap
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Category: Category2<URI> = {
  URI,
  compose,
  id
}
