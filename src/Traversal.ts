/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * A `Traversal` is the generalisation of an `Optional` to several targets. In other word, a `Traversal` allows to focus
 * from a type `S` into `0` to `n` values of type `A`.
 *
 * The most common example of a `Traversal` would be to focus into all elements inside of a container (e.g.
 * `ReadonlyArray`, `Option`). To do this we will use the relation between the typeclass `Traversable` and `Traversal`.
 *
 * @since 2.3.0
 */
import { Applicative, Applicative1, Applicative2, Applicative2C, Applicative3 } from 'fp-ts/lib/Applicative'
import { Category2 } from 'fp-ts/lib/Category'
import * as C from 'fp-ts/lib/Const'
import { Either } from 'fp-ts/lib/Either'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Monoid } from 'fp-ts/lib/Monoid'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import { Semigroupoid2 } from 'fp-ts/lib/Semigroupoid'
import { Traversable, Traversable1, Traversable2, Traversable3 } from 'fp-ts/lib/Traversable'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'
import { Optional } from './Optional'
import { Prism } from './Prism'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.3.0
 */
export interface ModifyF<S, A> {
  <F extends URIS3>(F: Applicative3<F>): <R, E>(f: (a: A) => Kind3<F, R, E, A>) => (s: S) => Kind3<F, R, E, S>
  <F extends URIS2>(F: Applicative2<F>): <E>(f: (a: A) => Kind2<F, E, A>) => (s: S) => Kind2<F, E, S>
  <F extends URIS2, E>(F: Applicative2C<F, E>): (f: (a: A) => Kind2<F, E, A>) => (s: S) => Kind2<F, E, S>
  <F extends URIS>(F: Applicative1<F>): (f: (a: A) => Kind<F, A>) => (s: S) => Kind<F, S>
  <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
}

/**
 * @category model
 * @since 2.3.0
 */
export interface Traversal<S, A> {
  readonly modifyF: ModifyF<S, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.8
 */
export const traversal: <S, A>(modifyF: Traversal<S, A>['modifyF']) => Traversal<S, A> = _.traversal

/**
 * @category constructors
 * @since 2.3.0
 */
export const id = <S>(): Traversal<S, S> => traversal(<F>(_: Applicative<F>) => (f: (s: S) => HKT<F, S>) => f)

/**
 * Create a `Traversal` from a `Traversable`.
 *
 * @category constructor
 * @since 2.3.0
 */
export const fromTraversable: {
  <T extends URIS3>(T: Traversable3<T>): <R, E, A>() => Traversal<Kind3<T, R, E, A>, A>
  <T extends URIS2>(T: Traversable2<T>): <E, A>() => Traversal<Kind2<T, E, A>, A>
  <T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Kind<T, A>, A>
  <T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
} = _.fromTraversable

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Traversal` with a `Traversal`.
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose: <A, B>(ab: Traversal<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  _.traversalComposeTraversal

/**
 * Alias of `compose`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeTraversal = compose

/**
 * Compose a `Traversal` with a `Iso`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  /*#__PURE__*/
  flow(_.isoAsTraversal, compose)

/**
 * Compose a `Traversal` with a `Lens`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  /*#__PURE__*/
  flow(_.lensAsTraversal, _.traversalComposeTraversal)

/**
 * Compose a `Traversal` with a `Prism`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  /*#__PURE__*/
  flow(_.prismAsTraversal, _.traversalComposeTraversal)

/**
 * Compose a `Traversal` with a `Optional`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  /*#__PURE__*/
  flow(_.optionalAsTraversal, _.traversalComposeTraversal)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = <A, B extends A = A>(f: (a: A) => B) => <S>(sa: Traversal<S, A>): ((s: S) => S) =>
  sa.modifyF(_.ApplicativeIdentity)(f)

/**
 * @category combinators
 * @since 2.3.0
 */
export const set = <A>(a: A): (<S>(sa: Traversal<S, A>) => (s: S) => S) => modify(() => a)

/**
 * Return a `Traversal` from a `Traversal` focused on a nullable value.
 *
 * @category combinators
 * @since 2.3.0
 */
export const fromNullable = <S, A>(sa: Traversal<S, A>): Traversal<S, NonNullable<A>> =>
  composePrism(_.prismFromNullable<A>())(sa)

/**
 * @category combinators
 * @since 2.3.0
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Traversal<S, A>) => Traversal<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Traversal<S, A>) => Traversal<S, A> {
  return compose(_.prismAsTraversal(_.prismFromPredicate(predicate)))
}

/**
 * Return a `Traversal` from a `Traversal` and a prop.
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Traversal<S, A>) => Traversal<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensProp(prop), _.lensAsTraversal))

/**
 * Return a `Traversal` from a `Traversal` and a list of props.
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = <A, P extends keyof A>(
  ...props: readonly [P, P, ...ReadonlyArray<P>]
): (<S>(sa: Traversal<S, A>) => Traversal<S, { [K in P]: A[K] }>) =>
  compose(pipe(_.lensId<A>(), _.lensProps(...props), _.lensAsTraversal))

/**
 * Return a `Traversal` from a `Traversal` focused on a component of a tuple.
 *
 * @category combinators
 * @since 2.3.0
 */
export const component = <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
): (<S>(sa: Traversal<S, A>) => Traversal<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensComponent(prop), _.lensAsTraversal))

/**
 * Return a `Traversal` from a `Traversal` focused on an index of a `ReadonlyArray`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number) => <S, A>(sa: Traversal<S, ReadonlyArray<A>>): Traversal<S, A> =>
  pipe(sa, compose(_.optionalAsTraversal(_.indexReadonlyArray<A>().index(i))))

/**
 * @category combinators
 * @since 2.3.8
 */
export const indexNonEmpty = (i: number) => <S, A>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>): Traversal<S, A> =>
  pipe(sa, compose(_.optionalAsTraversal(_.indexReadonlyNonEmptyArray<A>().index(i))))

/**
 * Return a `Traversal` from a `Traversal` focused on a key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const key = (key: string) => <S, A>(sa: Traversal<S, ReadonlyRecord<string, A>>): Traversal<S, A> =>
  pipe(sa, compose(_.optionalAsTraversal(_.indexReadonlyRecord<A>().index(key))))

/**
 * Return a `Traversal` from a `Traversal` focused on a required key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const atKey = (key: string) => <S, A>(sa: Traversal<S, ReadonlyRecord<string, A>>): Traversal<S, Option<A>> =>
  pipe(sa, compose(_.lensAsTraversal(_.atReadonlyRecord<A>().at(key))))

/**
 * Return a `Traversal` from a `Traversal` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Traversal<S, Option<A>>) => Traversal<S, A> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsTraversal(/*#__PURE__*/ _.prismSome()))

/**
 * Return a `Traversal` from a `Traversal` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const right: <S, E, A>(sea: Traversal<S, Either<E, A>>) => Traversal<S, A> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsTraversal(/*#__PURE__*/ _.prismRight()))

/**
 * Return a `Traversal` from a `Traversal` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const left: <S, E, A>(sea: Traversal<S, Either<E, A>>) => Traversal<S, E> =
  /*#__PURE__*/
  compose(/*#__PURE__*/ _.prismAsTraversal(/*#__PURE__*/ _.prismLeft()))

/**
 * Return a `Traversal` from a `Traversal` focused on a `Traversable`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const traverse: <T extends URIS>(
  T: Traversable1<T>
) => <S, A>(sta: Traversal<S, Kind<T, A>>) => Traversal<S, A> = _.traversalTraverse

/**
 * @category combinators
 * @since 2.3.8
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Traversal<S, ReadonlyArray<A>>) => Traversal<S, B>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Traversal<S, ReadonlyArray<A>>) => Traversal<S, A>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Traversal<S, ReadonlyArray<A>>) => Traversal<S, A> {
  return composeOptional(_.optionalFindFirst(predicate))
}

/**
 * @category combinators
 * @since 2.3.8
 */
export function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>) => Traversal<S, B>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>) => Traversal<S, A>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>) => Traversal<S, A> {
  return composeOptional(_.optionalFindFirstNonEmpty(predicate))
}

/**
 * Map each target to a `Monoid` and combine the results.
 *
 * @category combinators
 * @since 2.3.0
 */
export const foldMap = <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <S>(sa: Traversal<S, A>): ((s: S) => M) =>
  sa.modifyF(C.getApplicative(M))((a) => C.make(f(a)))

/**
 * Map each target to a `Monoid` and combine the results.
 *
 * @category combinators
 * @since 2.3.0
 */
export const fold = <A>(M: Monoid<A>): (<S>(sa: Traversal<S, A>) => (s: S) => A) => foldMap(M)(identity)

/**
 * Get all the targets of a `Traversal`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const getAll = <S>(s: S) => <A>(sa: Traversal<S, A>): ReadonlyArray<A> =>
  foldMap(RA.getMonoid<A>())<A>(RA.of)(sa)(s)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 2.3.0
 */
export const URI = 'monocle-ts/Traversal'

/**
 * @category instances
 * @since 2.3.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Traversal<E, A>
  }
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
