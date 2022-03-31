/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * An `Optional` is an optic used to zoom inside a product. Unlike the `Lens`, the element that the `Optional` focuses
 * on may not exist.
 *
 * `Optional`s have two type parameters generally called `S` and `A`: `Optional<S, A>` where `S` represents the product
 * and `A` an optional element inside of `S`.
 *
 * Laws:
 *
 * 1. `pipe(getOption(s), fold(() => s, a => set(a)(s))) = s`
 * 2. `getOption(set(a)(s)) = pipe(getOption(s), map(_ => a))`
 * 3. `set(a)(set(a)(s)) = set(a)(s)`
 *
 * @since 2.3.0
 */
import { Applicative, Applicative1, Applicative2, Applicative3 } from 'fp-ts/lib/Applicative'
import { Category2 } from 'fp-ts/lib/Category'
import { Either } from 'fp-ts/lib/Either'
import { constant, flow, Predicate, Refinement } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import { Semigroupoid2 } from 'fp-ts/lib/Semigroupoid'
import { Traversable1 } from 'fp-ts/lib/Traversable'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'
import { Prism } from './Prism'
import { Traversal } from './Traversal'

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
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.8
 */
export const optional: <S, A>(getOption: Optional<S, A>['getOption'], set: Optional<S, A>['set']) => Optional<S, A> =
  _.optional

/**
 * @category constructors
 * @since 2.3.0
 */
export const id = <S>(): Optional<S, S> => optional(O.some, constant)

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Optional` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Optional<S, A>) => Traversal<S, A> = _.optionalAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Optional` with a `Optional`.
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  _.optionalComposeOptional

/**
 * Alias of `compose`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeOptional = compose

/**
 * Compose a `Optional` with a `Iso`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  /*#__PURE__*/
  flow(_.isoAsOptional, compose)

/**
 * Compose a `Optional` with a `Lens`.
 *
 * @category compositions
 * @since 2.3.7
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  /*#__PURE__*/
  flow(_.lensAsOptional, _.optionalComposeOptional)

/**
 * Compose a `Optional` with a `Prism`.
 *
 * @category compositions
 * @since 2.3.7
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  /*#__PURE__*/
  flow(_.prismAsOptional, _.optionalComposeOptional)

/**
 * Compose a `Optional` with an `Traversal`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeTraversal = <A, B>(ab: Traversal<A, B>): (<S>(sa: Optional<S, A>) => Traversal<S, B>) =>
  flow(asTraversal, _.traversalComposeTraversal(ab))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modifyOption: <A, B extends A = A>(
  f: (a: A) => B
) => <S>(optional: Optional<S, A>) => (s: S) => Option<S> = _.optionalModifyOption

/**
 * @category combinators
 * @since 2.3.7
 */
export const setOption = <A>(a: A): (<S>(optional: Optional<S, A>) => (s: S) => Option<S>) => modifyOption(() => a)

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify: <A, B extends A = A>(f: (a: A) => B) => <S>(optional: Optional<S, A>) => (s: S) => S =
  _.optionalModify

/**
 * @category combinators
 * @since 2.3.5
 */
export function modifyF<F extends URIS3>(
  F: Applicative3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Optional<S, A>) => (s: S) => Kind3<F, R, E, S>
export function modifyF<F extends URIS2>(
  F: Applicative2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Optional<S, A>) => (s: S) => Kind2<F, E, S>
export function modifyF<F extends URIS>(
  F: Applicative1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Optional<S, A>) => (s: S) => Kind<F, S>
export function modifyF<F>(
  F: Applicative<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Optional<S, A>) => (s: S) => HKT<F, S>
export function modifyF<F>(
  F: Applicative<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Optional<S, A>) => (s: S) => HKT<F, S> {
  return (f) => (sa) => (s) =>
    pipe(
      sa.getOption(s),
      O.fold(
        () => F.of(s),
        (a) => F.map(f(a), (a) => sa.set(a)(s))
      )
    )
}

/**
 * Return an `Optional` from a `Optional` focused on a nullable value.
 *
 * @category combinators
 * @since 2.3.3
 */
export const fromNullable: <S, A>(sa: Optional<S, A>) => Optional<S, NonNullable<A>> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsOptional(/*#__PURE__*/ _.prismFromNullable()))

/**
 * @category combinators
 * @since 2.3.0
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Optional<S, A>) => Optional<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Optional<S, A>) => Optional<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Optional<S, A>) => Optional<S, A> {
  return compose(_.prismAsOptional(_.prismFromPredicate(predicate)))
}

/**
 * Return a `Optional` from a `Optional` and a prop.
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensProp(prop), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` and a list of props.
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = <A, P extends keyof A>(
  ...props: readonly [P, P, ...ReadonlyArray<P>]
): (<S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>) =>
  compose(pipe(_.lensId<A>(), _.lensProps(...props), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` focused on a component of a tuple.
 *
 * @category combinators
 * @since 2.3.0
 */
export const component = <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensComponent(prop), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` focused on an index of a `ReadonlyArray`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const index: (i: number) => <S, A>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A> = _.optionalIndex

/**
 * Return a `Optional` from a `Optional` focused on an index of a `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.3.8
 */
export const indexNonEmpty: (i: number) => <S, A>(sa: Optional<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A> =
  _.optionalIndexNonEmpty

/**
 * Return a `Optional` from a `Optional` focused on a key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const key: (key: string) => <S, A>(sa: Optional<S, ReadonlyRecord<string, A>>) => Optional<S, A> = _.optionalKey

/**
 * Return a `Optional` from a `Optional` focused on a required key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const atKey = (key: string) => <S, A>(sa: Optional<S, ReadonlyRecord<string, A>>): Optional<S, Option<A>> =>
  pipe(sa, compose(_.lensAsOptional(_.atReadonlyRecord<A>().at(key))))

/**
 * Return a `Optional` from a `Optional` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Optional<S, Option<A>>) => Optional<S, A> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsOptional(/*#__PURE__*/ _.prismSome()))

/**
 * Return a `Optional` from a `Optional` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const right: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, A> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsOptional(/*#__PURE__*/ _.prismRight()))

/**
 * Return a `Optional` from a `Optional` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const left: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, E> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsOptional(/*#__PURE__*/ _.prismLeft()))

/**
 * Return a `Traversal` from a `Optional` focused on a `Traversable`.
 *
 * @category combinators
 * @since 2.3.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Optional<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalTraverse(T))
}

/**
 * @category combinators
 * @since 2.3.2
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, B>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A> {
  return compose(_.optionalFindFirst(predicate))
}

/**
 * @category combinators
 * @since 2.3.8
 */
export function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Optional<S, ReadonlyNonEmptyArray<A>>) => Optional<S, B>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Optional<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Optional<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A> {
  return compose(_.optionalFindFirstNonEmpty(predicate))
}

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Optional<E, A>) => Optional<E, B> = (f, g) => (
  ea
) => imap_(ea, f, g)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => optional(flow(ea.getOption, O.map(ab)), flow(ba, ea.set))

/**
 * @category instances
 * @since 2.3.0
 */
export const URI = 'monocle-ts/Optional'

/**
 * @category instances
 * @since 2.3.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Optional<E, A>
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
