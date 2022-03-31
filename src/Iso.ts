/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * An `Iso` is an optic which converts elements of type `S` into elements of type `A` without loss.
 *
 * Laws:
 *
 * 1. `reverseGet(get(s)) = s`
 * 2. `get(reversetGet(a)) = a`
 *
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { Either } from 'fp-ts/lib/Either'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { Functor, Functor1, Functor2, Functor3 } from 'fp-ts/lib/Functor'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import { Semigroupoid2 } from 'fp-ts/lib/Semigroupoid'
import { Traversable1 } from 'fp-ts/lib/Traversable'
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
 * @since 2.3.8
 */
export const iso: <S, A>(get: Iso<S, A>['get'], reverseGet: Iso<S, A>['reverseGet']) => Iso<S, A> = _.iso

/**
 * @category constructors
 * @since 2.3.0
 */
export const id = <S>(): Iso<S, S> => iso(identity, identity)

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View an `Iso` as a `Lens`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asLens: <S, A>(sa: Iso<S, A>) => Lens<S, A> = _.isoAsLens

/**
 * View an `Iso` as a `Prism`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asPrism: <S, A>(sa: Iso<S, A>) => Prism<S, A> = _.isoAsPrism

/**
 * View an `Iso` as a `Optional`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Iso<S, A>) => Optional<S, A> = _.isoAsOptional

/**
 * View an `Iso` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Iso<S, A>) => Traversal<S, A> = _.isoAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose an `Iso` with an `Iso`.
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose = <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>): Iso<S, B> =>
  iso(flow(sa.get, ab.get), flow(ab.reverseGet, sa.reverseGet))

/**
 * Alias of `compose`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeIso = compose

/**
 * Compose an `Iso` with a `Lens`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeLens = <A, B>(ab: Lens<A, B>): (<S>(sa: Iso<S, A>) => Lens<S, B>) =>
  flow(asLens, _.lensComposeLens(ab))

/**
 * Compose an `Iso` with a `Prism`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composePrism = <A, B>(ab: Prism<A, B>): (<S>(sa: Iso<S, A>) => Prism<S, B>) =>
  flow(asPrism, _.prismComposePrism(ab))

/**
 * Compose an `Iso` with a `Optional`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeOptional = <A, B>(ab: Optional<A, B>): (<S>(sa: Iso<S, A>) => Optional<S, B>) =>
  flow(asOptional, _.optionalComposeOptional(ab))

/**
 * Compose an `Iso` with a `Traversal`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeTraversal = <A, B>(ab: Traversal<A, B>): (<S>(sa: Iso<S, A>) => Traversal<S, B>) =>
  flow(asTraversal, _.traversalComposeTraversal(ab))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.0
 */
export const reverse = <S, A>(sa: Iso<S, A>): Iso<A, S> => iso(sa.reverseGet, sa.get)

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = <A, B extends A = A>(f: (a: A) => B) => <S>(sa: Iso<S, A>) => (s: S): S =>
  sa.reverseGet(f(sa.get(s)))

/**
 * @category combinators
 * @since 2.3.5
 */
export function modifyF<F extends URIS3>(
  F: Functor3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Iso<S, A>) => (s: S) => Kind3<F, R, E, S>
export function modifyF<F extends URIS2>(
  F: Functor2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Iso<S, A>) => (s: S) => Kind2<F, E, S>
export function modifyF<F extends URIS>(
  F: Functor1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Iso<S, A>) => (s: S) => Kind<F, S>
export function modifyF<F>(F: Functor<F>): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Iso<S, A>) => (s: S) => HKT<F, S>
export function modifyF<F>(F: Functor<F>): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Iso<S, A>) => (s: S) => HKT<F, S> {
  return (f) => (sa) => (s) => pipe(sa.get(s), f, (fa) => F.map(fa, sa.reverseGet))
}

/**
 * Return a `Prism` from a `Iso` focused on a nullable value.
 *
 * @category combinators
 * @since 2.3.8
 */
export const fromNullable = <S, A>(sa: Iso<S, A>): Prism<S, NonNullable<A>> =>
  composePrism(_.prismFromNullable<A>())(sa)

/**
 * @category combinators
 * @since 2.3.8
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Iso<S, A>) => Prism<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Iso<S, A>) => Prism<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Iso<S, A>) => Prism<S, A> {
  return composePrism(_.prismFromPredicate(predicate))
}

/**
 * Return a `Lens` from a `Iso` and a prop.
 *
 * @category combinators
 * @since 2.3.8
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Iso<S, A>) => Lens<S, A[P]>) =>
  flow(asLens, _.lensProp(prop))

/**
 * Return a `Lens` from a `Iso` and a list of props.
 *
 * @category combinators
 * @since 2.3.8
 */
export const props = <A, P extends keyof A>(
  ...props: readonly [P, P, ...ReadonlyArray<P>]
): (<S>(sa: Iso<S, A>) => Lens<S, { [K in P]: A[K] }>) => flow(asLens, _.lensProps(...props))

/**
 * Return a `Lens` from a `Iso` focused on a component of a tuple.
 *
 * @category combinators
 * @since 2.3.8
 */
export const component = <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
): (<S>(sa: Iso<S, A>) => Lens<S, A[P]>) => flow(asLens, _.lensComponent(prop))

/**
 * Return a `Optional` from a `Iso` focused on an index of a `ReadonlyArray`.
 *
 * @category combinators
 * @since 2.3.8
 */
export const index = (i: number): (<S, A>(sa: Iso<S, ReadonlyArray<A>>) => Optional<S, A>) =>
  flow(asOptional, _.optionalIndex(i))

/**
 * Return a `Optional` from a `Iso` focused on an index of a `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.3.8
 */
export const indexNonEmpty = (i: number): (<S, A>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>) =>
  flow(asOptional, _.optionalIndexNonEmpty(i))

/**
 * Return a `Optional` from a `Iso` focused on a key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.8
 */
export const key = (key: string): (<S, A>(sa: Iso<S, ReadonlyRecord<string, A>>) => Optional<S, A>) =>
  flow(asOptional, _.optionalKey(key))

/**
 * Return a `Lens` from a `Iso` focused on a required key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.8
 */
export const atKey = (key: string): (<S, A>(sa: Iso<S, ReadonlyRecord<string, A>>) => Lens<S, Option<A>>) =>
  flow(asLens, _.lensAtKey(key))

/**
 * Return a `Prism` from a `Iso` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 2.3.8
 */
export const some: <S, A>(soa: Iso<S, Option<A>>) => Prism<S, A> =
  /*#__PURE__*/
  composePrism(/*#__PURE__*/ _.prismSome())

/**
 * Return a `Prism` from a `Iso` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.8
 */
export const right: <S, E, A>(sea: Iso<S, Either<E, A>>) => Prism<S, A> =
  /*#__PURE__*/
  composePrism(/*#__PURE__*/ _.prismRight())

/**
 * Return a `Prism` from a `Iso` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.8
 */
export const left: <S, E, A>(sea: Iso<S, Either<E, A>>) => Prism<S, E> =
  /*#__PURE__*/
  composePrism(/*#__PURE__*/ _.prismLeft())

/**
 * Return a `Traversal` from a `Iso` focused on a `Traversable`.
 *
 * @category combinators
 * @since 2.3.8
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Iso<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalTraverse(T))
}

/**
 * @category combinators
 * @since 2.3.8
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Iso<S, ReadonlyArray<A>>) => Optional<S, B>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Iso<S, ReadonlyArray<A>>) => Optional<S, A>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Iso<S, ReadonlyArray<A>>) => Optional<S, A> {
  return composeOptional(_.optionalFindFirst(predicate))
}

/**
 * @category combinators
 * @since 2.3.8
 */
export function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, B>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A> {
  return composeOptional(_.optionalFindFirstNonEmpty(predicate))
}

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <S>(sa: Iso<S, A>) => Iso<S, B> = (f, g) => (ea) =>
  imap_(ea, f, g)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => iso(flow(ea.get, ab), flow(ba, ea.reverseGet))

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
export const Invariant: Invariant2<URI> = {
  URI,
  imap: imap_
}

/**
 * @category instances
 * @since 2.3.8
 */
export const Semigroupoid: Semigroupoid2<URI> = {
  URI,
  compose: (ab, ea) => compose(ab)(ea)
}

/**
 * @category instances
 * @since 2.3.0
 */
export const Category: Category2<URI> = {
  URI,
  compose: Semigroupoid.compose,
  id
}
