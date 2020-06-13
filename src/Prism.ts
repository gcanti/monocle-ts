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
import * as O from 'fp-ts/lib/Option'
import * as I from './internal'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import Option = O.Option
import { Refinement, Predicate } from 'fp-ts/lib/function'
import { Optional } from './Optional'
import { Traversal } from './Traversal'
import { Iso } from './Iso'
import { Lens } from './Lens'

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
export const fromPredicate: {
  <S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
  <A>(predicate: Predicate<A>): Prism<A, A>
} = I.prismFromPredicate

/**
 * @category constructors
 * @since 2.3.0
 */
export const some: <A>() => Prism<O.Option<A>, A> = I.prismSome

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromNullable: <A>() => Prism<A, NonNullable<A>> = I.prismFromNullable

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Prism` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Prism<S, A>) => Optional<S, A> = I.prismAsOptional

/**
 * View a `Prism` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Prism<S, A>) => Traversal<S, A> = I.prismAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Prism` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B> = I.prismComposeIso

/**
 * Compose a `Prism` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B> = I.prismComposePrism

/**
 * Compose a `Prism` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B> = I.prismComposeLens

/**
 * Compose a `Prism` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B> =
  I.prismComposeOptional

/**
 * Compose a `Prism` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Prism<S, A>) => Traversal<S, B> =
  I.prismComposeTraversal

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modifyOption: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => O.Option<S> = I.prismModifyOption

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => S = I.prismModify

/**
 * @category combinators
 * @since 2.3.0
 */
export const set: <A>(a: A) => <S>(sa: Prism<S, A>) => (s: S) => S = I.prismSet

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Return a `Optional` from a `Prism` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Prism<S, A>) => Optional<S, A[P]> = I.prismProp

/**
 * Return a `Optional` from a `Prism` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props: <A, P extends keyof A>(...props: P[]) => <S>(sa: Prism<S, A>) => Optional<S, { [K in P]: A[K] }> =
  I.prismProps
