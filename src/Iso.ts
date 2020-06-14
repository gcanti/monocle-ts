/**
 * An `Iso` is an optic which converts elements of type `S` into elements of type `A` without loss.
 *
 * Laws:
 *
 * 1. reverseGet(get(s)) = s
 * 2. get(reversetGet(a)) = a
 *
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { flow, identity } from 'fp-ts/lib/function'
import { Invariant2 } from 'fp-ts/lib/Invariant'
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
 * @since 2.3.0
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
 * @since 2.3.0
 */
export const id = <S>(): Iso<S, S> => ({
  get: identity,
  reverseGet: identity
})

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View an `Iso` as a `Lens`
 *
 * @category converters
 * @since 2.3.0
 */
export const asLens: <S, A>(sa: Iso<S, A>) => Lens<S, A> = _.isoAsLens

/**
 * View an `Iso` as a `Prism`
 *
 * @category converters
 * @since 2.3.0
 */
export const asPrism: <S, A>(sa: Iso<S, A>) => Prism<S, A> = _.isoAsPrism

/**
 * View an `Iso` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Iso<S, A>) => Optional<S, A> = _.isoAsOptional

/**
 * View an `Iso` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Iso<S, A>) => Traversal<S, A> = _.isoAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose an `Iso` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>) => Iso<S, B> = _.isoComposeIso

/**
 * Compose an `Iso` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Iso<S, A>) => Lens<S, B> = _.isoComposeLens

/**
 * Compose an `Iso` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Iso<S, A>) => Prism<S, B> = _.isoComposePrism

/**
 * Compose an `Iso` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Iso<S, A>) => Optional<S, B> = _.isoComposeOptional

/**
 * Compose an `Iso` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Iso<S, A>) => Traversal<S, B> =
  _.isoComposeTraversal

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.0
 */
export const reverse = <S, A>(iso: Iso<S, A>): Iso<A, S> => ({
  get: iso.reverseGet,
  reverseGet: iso.get
})

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = <A>(f: (a: A) => A) => <S>(iso: Iso<S, A>) => (s: S): S => iso.reverseGet(f(iso.get(s)))

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Iso<E, A>) => Iso<E, B> = (f, g) => (ea) =>
  imap_(ea, f, g)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => ({
  get: flow(ea.get, ab),
  reverseGet: flow(ba, ea.reverseGet)
})

/**
 * @category instances
 * @since 2.3.0
 */
export const URI = 'monocle-ts/Iso'

/**
 * @category instances
 * @since 2.3.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Iso<E, A>
  }
}

/**
 * @category instances
 * @since 2.3.0
 */
export const invariantIso: Invariant2<URI> = {
  URI,
  imap: imap_
}

/**
 * @category instances
 * @since 2.3.0
 */
export const categoryIso: Category2<URI> = {
  URI,
  compose: (ab, ea) => composeIso(ab)(ea),
  id
}
