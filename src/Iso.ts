/**
 * @since 2.3.0
 */
import { identity } from 'fp-ts/lib/function'
import * as I from './internal'

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
export const asLens = I.isoAsLens

/**
 * View an `Iso` as a `Prism`
 *
 * @category converters
 * @since 2.3.0
 */
export const asPrism = I.isoAsPrism

/**
 * View an `Iso` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional = I.isoAsOptional

/**
 * View an `Iso` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal = I.isoAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose an `Iso` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose = I.isoComposeIso

/**
 * Compose an `Iso` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens = I.isoComposeLens

/**
 * Compose an `Iso` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism = I.isoComposePrism

/**
 * Compose an `Iso` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional = I.isoComposeOptional

/**
 * Compose an `Iso` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal = I.isoComposeTraversal

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
