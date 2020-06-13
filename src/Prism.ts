/**
 * A `Prism` is an optic used to select part of a sum type.
 *
 * Laws:
 *
 * 1. getOption(s).fold(s, reverseGet) = s
 * 2. getOption(reverseGet(a)) = Some(a)
 *
 * @since 2.3.0
 */
import { identity } from 'fp-ts/lib/function'
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
export interface Prism<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly reverseGet: (a: A) => S
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromPredicate = I.prismFromPredicate

/**
 * @category constructors
 * @since 2.3.0
 */
export const some = <A>(): Prism<Option<A>, A> => ({
  getOption: identity,
  reverseGet: O.some
})

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromNullable = <A>(): Prism<A, NonNullable<A>> => ({
  getOption: O.fromNullable,
  reverseGet: identity
})

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Prism` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional = I.prismAsOptional

/**
 * View a `Prism` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal = I.prismAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Prism` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso = I.prismComposeIso

/**
 * Compose a `Prism` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose = I.prismComposePrism

/**
 * Compose a `Prism` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens = I.prismComposeLens

/**
 * Compose a `Prism` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional = I.prismComposeOptional

/**
 * Compose a `Prism` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal = I.prismComposeTraversal

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modifyOption = I.prismModifyOption

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = I.prismModify

/**
 * @category combinators
 * @since 2.3.0
 */
export const set = I.prismSet

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Return a `Optional` from a `Prism` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = I.prismProp

/**
 * Return a `Optional` from a `Prism` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = I.prismProps
