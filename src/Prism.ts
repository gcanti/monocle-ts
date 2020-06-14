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
import { identity, Predicate, Refinement } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'
import { Optional } from './Optional'
import { Traversal } from './Traversal'

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
export const id = <S>(): Prism<S, S> => ({
  getOption: O.some,
  reverseGet: identity
})

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromPredicate: {
  <S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
  <A>(predicate: Predicate<A>): Prism<A, A>
} = _.prismFromPredicate

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromSome: <A>() => Prism<Option<A>, A> = _.prismFromSome

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromNullable: <A>() => Prism<A, NonNullable<A>> = _.prismFromNullable

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Prism` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Prism<S, A>) => Optional<S, A> = _.prismAsOptional

/**
 * View a `Prism` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Prism<S, A>) => Traversal<S, A> = _.prismAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Prism` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B> = _.prismComposeIso

/**
 * Compose a `Prism` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B> = _.prismComposePrism

/**
 * Compose a `Prism` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B> = _.prismComposeLens

/**
 * Compose a `Prism` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B> =
  _.prismComposeOptional

/**
 * Compose a `Prism` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Prism<S, A>) => Traversal<S, B> =
  _.prismComposeTraversal

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modifyOption: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => Option<S> = _.prismModifyOption

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => S = _.prismModify

/**
 * @category combinators
 * @since 2.3.0
 */
export const set: <A>(a: A) => <S>(sa: Prism<S, A>) => (s: S) => S = _.prismSet

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * Return a `Optional` from a `Prism` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Prism<S, A>) => Optional<S, A[P]>) =>
  composeLens(pipe(_.lensId<A>(), _.lensProp(prop)))

/**
 * Return a `Optional` from a `Prism` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = <A, P extends keyof A>(...props: P[]): (<S>(sa: Prism<S, A>) => Optional<S, { [K in P]: A[K] }>) =>
  composeLens(pipe(_.lensId<A>(), _.lensProps(...props)))

/**
 * Return a `Prism` from a `Prism` focused on a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Prism<S, Option<A>>) => Prism<S, A> = composePrism(_.prismFromSome())
