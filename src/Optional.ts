/**
 * An `Optional` is an optic used to zoom inside a product. Unlike the `Lens`, the element that the `Optional` focuses
 * on may not exist.
 *
 * `Optional`s have two type parameters generally called `S` and `A`: `Optional<S, A>` where `S` represents the product
 * and `A` an optional element inside of `S`.
 *
 * Laws:
 *
 * 1. getOption(s).fold(() => s, a => set(a)(s)) = s
 * 2. getOption(set(a)(s)) = getOption(s).map(_ => a)
 * 3. set(a)(set(a)(s)) = set(a)(s)
 *
 * @since 2.3.0
 */
import * as O from 'fp-ts/lib/Option'
import * as I from './internal'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import Option = O.Option

/**
 * @category model
 * @since 2.3.0
 */
export interface Optional<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly set: (a: A) => (s: S) => S
}

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Optional` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal = I.optionalAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Optional` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso = I.optionalComposeIso

/**
 * Compose a `Optional` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens = I.optionalComposeLens

/**
 * Compose a `Optional` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism = I.optionalComposePrism

/**
 * Compose a `Optional` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose = I.optionalComposeOptional

/**
 * Compose a `Optional` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal = I.optionalComposeTraversal

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modifyOption = I.optionalModifyOption

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = I.optionalModify

/**
 * Return a `Optional` from a `Optional` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = I.optionalProp

/**
 * Return a `Optional` from a `Optional` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = I.optionalProps
