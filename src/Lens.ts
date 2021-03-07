/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * A `Lens` is an optic used to zoom inside a product.
 *
 * `Lens`es have two type parameters generally called `S` and `A`: `Lens<S, A>` where `S` represents the product and `A`
 * an element inside of `S`.
 *
 * Laws:
 *
 * 1. `get(set(a)(s)) = a`
 * 2. `set(get(s))(s) = s`
 * 3. `set(a)(set(a)(s)) = set(a)(s)`
 *
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { Either } from 'fp-ts/lib/Either'
import { flow, Predicate, Refinement } from 'fp-ts/lib/function'
import { Functor, Functor1, Functor2, Functor3 } from 'fp-ts/lib/Functor'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import { Traversable1 } from 'fp-ts/lib/Traversable'
import * as _ from './internal'
import { Iso } from './Iso'
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
export interface Lens<S, A> {
  readonly get: (s: S) => A
  readonly set: (a: A) => (s: S) => S
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.8
 */
export const lens: <S, A>(get: Lens<S, A>['get'], set: Lens<S, A>['set']) => Lens<S, A> = _.lens

/**
 * @category constructors
 * @since 2.3.0
 */
export const id: <S>() => Lens<S, S> = _.lensId

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Lens` as a `Optional`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Lens<S, A>) => Optional<S, A> = _.lensAsOptional

/**
 * View a `Lens` as a `Traversal`.
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Lens<S, A>) => Traversal<S, A> = _.lensAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Lens` with a `Lens`.
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B> = _.lensComposeLens

/**
 * Alias of `compose`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeLens = compose

/**
 * Compose a `Lens` with a `Iso`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B> =
  /*#__PURE__*/
  flow(_.isoAsLens, compose)

/**
 * Compose a `Lens` with a `Prism`.
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B> = _.lensComposePrism

/**
 * Compose a `Lens` with an `Optional`.
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional = <A, B>(ab: Optional<A, B>): (<S>(sa: Lens<S, A>) => Optional<S, B>) =>
  flow(asOptional, _.optionalComposeOptional(ab))

/**
 * Compose a `Lens` with an `Traversal`.
 *
 * @category compositions
 * @since 2.3.8
 */
export const composeTraversal = <A, B>(ab: Traversal<A, B>): (<S>(sa: Lens<S, A>) => Traversal<S, B>) =>
  flow(asTraversal, _.traversalComposeTraversal(ab))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = <A>(f: (a: A) => A) => <S>(sa: Lens<S, A>) => (s: S): S => {
  const o = sa.get(s)
  const n = f(o)
  return o === n ? s : sa.set(n)(s)
}

/**
 * @category combinators
 * @since 2.3.5
 */
export function modifyF<F extends URIS3>(
  F: Functor3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Lens<S, A>) => (s: S) => Kind3<F, R, E, S>
export function modifyF<F extends URIS2>(
  F: Functor2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Lens<S, A>) => (s: S) => Kind2<F, E, S>
export function modifyF<F extends URIS>(
  F: Functor1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Lens<S, A>) => (s: S) => Kind<F, S>
export function modifyF<F>(F: Functor<F>): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Lens<S, A>) => (s: S) => HKT<F, S>
export function modifyF<F>(F: Functor<F>): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Lens<S, A>) => (s: S) => HKT<F, S> {
  return (f) => (sa) => (s) => pipe(sa.get(s), f, (fa) => F.map(fa, (a) => sa.set(a)(s)))
}

/**
 * Return a `Optional` from a `Lens` focused on a nullable value.
 *
 * @category combinators
 * @since 2.3.0
 */
export const fromNullable = <S, A>(sa: Lens<S, A>): Optional<S, NonNullable<A>> =>
  composePrism(_.prismFromNullable<A>())(sa)

/**
 * @category combinators
 * @since 2.3.0
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Lens<S, A>) => Optional<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Lens<S, A>) => Optional<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Lens<S, A>) => Optional<S, A> {
  return composePrism(_.prismFromPredicate(predicate))
}

/**
 * Return a `Lens` from a `Lens` and a prop.
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Lens<S, A>) => Lens<S, A[P]> = _.lensProp

/**
 * Return a `Lens` from a `Lens` and a list of props.
 *
 * @category combinators
 * @since 2.3.0
 */
export const props: <A, P extends keyof A>(
  ...props: readonly [P, P, ...ReadonlyArray<P>]
) => <S>(sa: Lens<S, A>) => Lens<S, { [K in P]: A[K] }> = _.lensProps

/**
 * Return a `Lens` from a `Lens` focused on a component of a tuple.
 *
 * @category combinators
 * @since 2.3.0
 */
export const component: <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
) => <S>(sa: Lens<S, A>) => Lens<S, A[P]> = _.lensComponent

/**
 * Return a `Optional` from a `Lens` focused on an index of a `ReadonlyArray`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number): (<S, A>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, A>) =>
  flow(asOptional, _.optionalIndex(i))

/**
 * Return a `Optional` from a `Lens` focused on an index of a `ReadonlyNonEmptyArray`.
 *
 * @category combinators
 * @since 2.3.8
 */
export const indexNonEmpty = (i: number): (<S, A>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>) =>
  flow(asOptional, _.optionalIndexNonEmpty(i))

/**
 * Return a `Optional` from a `Lens` focused on a key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const key = (key: string): (<S, A>(sa: Lens<S, ReadonlyRecord<string, A>>) => Optional<S, A>) =>
  flow(asOptional, _.optionalKey(key))

/**
 * Return a `Lens` from a `Lens` focused on a required key of a `ReadonlyRecord`.
 *
 * @category combinators
 * @since 2.3.0
 */
export const atKey: (key: string) => <S, A>(sa: Lens<S, ReadonlyRecord<string, A>>) => Lens<S, Option<A>> = _.lensAtKey

/**
 * Return a `Optional` from a `Lens` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Lens<S, Option<A>>) => Optional<S, A> =
  /*#__PURE__*/
  composePrism(_.prismSome())

/**
 * Return a `Optional` from a `Lens` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const right: <S, E, A>(sea: Lens<S, Either<E, A>>) => Optional<S, A> =
  /*#__PURE__*/
  composePrism(_.prismRight())

/**
 * Return a `Optional` from a `Lens` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 2.3.0
 */
export const left: <S, E, A>(sea: Lens<S, Either<E, A>>) => Optional<S, E> =
  /*#__PURE__*/
  composePrism(_.prismLeft())

/**
 * Return a `Traversal` from a `Lens` focused on a `Traversable`.
 *
 * @category combinators
 * @since 2.3.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Lens<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalTraverse(T))
}

/**
 * @category combinators
 * @since 2.3.2
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, B>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, A>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, A> {
  return composeOptional(_.optionalFindFirst(predicate))
}

/**
 * @category combinators
 * @since 2.3.8
 */
export function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, B>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
export function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A> {
  return composeOptional(_.optionalFindFirstNonEmpty(predicate))
}

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(sa: Lens<E, A>) => Lens<E, B> = (f, g) => (ea) =>
  imap_(ea, f, g)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => lens(flow(ea.get, ab), flow(ba, ea.set))

/**
 * @category instances
 * @since 2.3.0
 */
export const URI = 'monocle-ts/Lens'

/**
 * @category instances
 * @since 2.3.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Lens<E, A>
  }
}

/**
 * @category instances
 * @since 2.3.0
 */
export const invariantLens: Invariant2<URI> = {
  URI,
  imap: imap_
}

/**
 * @category instances
 * @since 2.3.0
 */
export const categoryLens: Category2<URI> = {
  URI,
  compose: (ab, ea) => compose(ab)(ea),
  id
}
