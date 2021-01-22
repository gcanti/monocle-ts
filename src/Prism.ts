/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * A `Prism` is an optic used to select part of a sum type.
 *
 * Laws:
 *
 * 1. pipe(getOption(s), fold(() => s, reverseGet)) = s
 * 2. getOption(reverseGet(a)) = some(a)
 *
 * @since 2.3.0
 */
import { Applicative, Applicative1, Applicative2, Applicative3 } from 'fp-ts/lib/Applicative'
import { Category2 } from 'fp-ts/lib/Category'
import { Either } from 'fp-ts/lib/Either'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Traversable1 } from 'fp-ts/lib/Traversable'
import * as _ from './internal'
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
 * Compose a `Prism` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose = <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>): Prism<S, B> => ({
  getOption: flow(sa.getOption, O.chain(ab.getOption)),
  reverseGet: flow(ab.reverseGet, sa.reverseGet)
})

/**
 * Compose a `Prism` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B> = _.prismComposeLens

/**
 * Compose a `Prism` with an `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Prism<S, A>): Optional<S, B> =>
  _.optionalComposeOptional(ab)(asOptional(sa))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const set: <A>(a: A) => <S>(sa: Prism<S, A>) => (s: S) => S = _.prismSet

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
 * @since 2.3.5
 */
export function modifyF<F extends URIS3>(
  F: Applicative3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Prism<S, A>) => (s: S) => Kind3<F, R, E, S>
export function modifyF<F extends URIS2>(
  F: Applicative2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Prism<S, A>) => (s: S) => Kind2<F, E, S>
export function modifyF<F extends URIS>(
  F: Applicative1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Prism<S, A>) => (s: S) => Kind<F, S>
export function modifyF<F>(
  F: Applicative<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Prism<S, A>) => (s: S) => HKT<F, S>
export function modifyF<F>(
  F: Applicative<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Prism<S, A>) => (s: S) => HKT<F, S> {
  return (f) => (sa) => (s) =>
    pipe(
      sa.getOption(s),
      O.fold(
        () => F.of(s),
        (a) => F.map(f(a), sa.reverseGet)
      )
    )
}

/**
 * Return a `Prism` from a `Prism` focused on a nullable value
 *
 * @category combinators
 * @since 2.3.3
 */
export const fromNullable: <S, A>(sa: Prism<S, A>) => Prism<S, NonNullable<A>> =
  /*#__PURE__*/
  compose(_.prismFromNullable())

/**
 * @category combinators
 * @since 2.3.0
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Prism<S, A>) => Prism<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Prism<S, A>) => Prism<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Prism<S, A>) => Prism<S, A> {
  return compose(_.prismFromPredicate(predicate))
}

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
export const props = <A, P extends keyof A>(
  ...props: [P, P, ...Array<P>]
): (<S>(sa: Prism<S, A>) => Optional<S, { [K in P]: A[K] }>) => composeLens(pipe(_.lensId<A>(), _.lensProps(...props)))

/**
 * Return a `Optional` from a `Prism` and a component
 *
 * @category combinators
 * @since 2.3.0
 */
export const component = <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
): (<S>(sa: Prism<S, A>) => Optional<S, A[P]>) => composeLens(pipe(_.lensId<A>(), _.lensComponent(prop)))

/**
 * Return a `Optional` from a `Prism` focused on a `ReadonlyArray`
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number) => <S, A>(sa: Prism<S, ReadonlyArray<A>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.indexArray<A>().index(i)))

/**
 * Return a `Optional` from a `Prism` focused on a `ReadonlyRecord` and a key
 *
 * @category combinators
 * @since 2.3.0
 */
export const key = (key: string) => <S, A>(sa: Prism<S, Readonly<Record<string, A>>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.indexRecord<A>().index(key)))

/**
 * Return a `Optional` from a `Prism` focused on a `ReadonlyRecord` and a required key
 *
 * @category combinators
 * @since 2.3.0
 */
export const atKey = (key: string) => <S, A>(sa: Prism<S, Readonly<Record<string, A>>>): Optional<S, Option<A>> =>
  _.prismComposeLens(_.atRecord<A>().at(key))(sa)

/**
 * Return a `Prism` from a `Prism` focused on the `Some` of a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Prism<S, Option<A>>) => Prism<S, A> =
  /*#__PURE__*/
  compose(_.prismSome())

/**
 * Return a `Prism` from a `Prism` focused on the `Right` of a `Either` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const right: <S, E, A>(sea: Prism<S, Either<E, A>>) => Prism<S, A> =
  /*#__PURE__*/
  compose(_.prismRight())

/**
 * Return a `Prism` from a `Prism` focused on the `Left` of a `Either` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const left: <S, E, A>(sea: Prism<S, Either<E, A>>) => Prism<S, E> =
  /*#__PURE__*/
  compose(_.prismLeft())

/**
 * Return a `Traversal` from a `Prism` focused on a `Traversable`
 *
 * @category combinators
 * @since 2.3.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Prism<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalComposeTraversal(_.fromTraversable(T)()))
}

/**
 * @category combinators
 * @since 2.3.2
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Prism<S, ReadonlyArray<A>>) => Optional<S, B>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Prism<S, ReadonlyArray<A>>) => Optional<S, A>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Prism<S, ReadonlyArray<A>>) => Optional<S, A> {
  return composeOptional(_.findFirst(predicate))
}

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(sa: Prism<E, A>) => Prism<E, B> = (f, g) => (ea) =>
  imap_(ea, f, g)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => ({
  getOption: flow(ea.getOption, O.map(ab)),
  reverseGet: flow(ba, ea.reverseGet)
})

/**
 * @category instances
 * @since 2.3.0
 */
export const URI = 'monocle-ts/Prism'

/**
 * @category instances
 * @since 2.3.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Prism<E, A>
  }
}

/**
 * @category instances
 * @since 2.3.0
 */
export const invariantPrism: Invariant2<URI> = {
  URI,
  imap: imap_
}

/**
 * @category instances
 * @since 2.3.0
 */
export const categoryPrism: Category2<URI> = {
  URI,
  compose: (ab, ea) => compose(ab)(ea),
  id
}
