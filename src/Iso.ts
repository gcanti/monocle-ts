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
import { identity } from 'fp-ts/lib/function'
import * as I from './internal'
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
export const asLens: <S, A>(sa: Iso<S, A>) => Lens<S, A> = I.isoAsLens

/**
 * View an `Iso` as a `Prism`
 *
 * @category converters
 * @since 2.3.0
 */
export const asPrism: <S, A>(sa: Iso<S, A>) => Prism<S, A> = I.isoAsPrism

/**
 * View an `Iso` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Iso<S, A>) => Optional<S, A> = I.isoAsOptional

/**
 * View an `Iso` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Iso<S, A>) => Traversal<S, A> = I.isoAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose an `Iso` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>) => Iso<S, B> = I.isoComposeIso

/**
 * Compose an `Iso` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Iso<S, A>) => Lens<S, B> = I.isoComposeLens

/**
 * Compose an `Iso` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Iso<S, A>) => Prism<S, B> = I.isoComposePrism

/**
 * Compose an `Iso` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Iso<S, A>) => Optional<S, B> = I.isoComposeOptional

/**
 * Compose an `Iso` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Iso<S, A>) => Traversal<S, B> =
  I.isoComposeTraversal

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
