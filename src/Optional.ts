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
 * 1. getOption(s).fold(() => s, a => set(a)(s)) = s
 * 2. getOption(set(a)(s)) = getOption(s).map(_ => a)
 * 3. set(a)(set(a)(s)) = set(a)(s)
 *
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { Either } from 'fp-ts/lib/Either'
import { constant, flow, Predicate, Refinement } from 'fp-ts/lib/function'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Traversable1 } from 'fp-ts/lib/Traversable'
import * as _ from './internal'
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
 * @since 2.3.0
 */
export const id = <S>(): Optional<S, S> => ({
  getOption: O.some,
  set: constant
})

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Optional` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Optional<S, A>) => Traversal<S, A> = _.optionalAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Optional` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  _.optionalComposeOptional

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modifyOption: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => Option<S> =
  _.optionalModifyOption

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => S = _.optionalModify

/**
 * Return an `Optional` from a `Optional` focused on a nullable value
 *
 * @category combinators
 * @since 2.3.3
 */
export const fromNullable: <S, A>(sa: Optional<S, A>) => Optional<S, NonNullable<A>> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismFromNullable()))

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
 * Return a `Optional` from a `Optional` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensProp(prop), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = <A, P extends keyof A>(
  ...props: [P, P, ...Array<P>]
): (<S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>) =>
  compose(pipe(_.lensId<A>(), _.lensProps(...props), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` and a component
 *
 * @category combinators
 * @since 2.3.0
 */
export const component = <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensComponent(prop), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` focused on a `ReadonlyArray`
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number) => <S, A>(sa: Optional<S, ReadonlyArray<A>>): Optional<S, A> =>
  pipe(sa, _.optionalComposeOptional(_.indexArray<A>().index(i)))

/**
 * Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a key
 *
 * @category combinators
 * @since 2.3.0
 */
export const key = (key: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>): Optional<S, A> =>
  pipe(sa, _.optionalComposeOptional(_.indexRecord<A>().index(key)))

/**
 * Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a required key
 *
 * @category combinators
 * @since 2.3.0
 */
export const atKey = (key: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>): Optional<S, Option<A>> =>
  pipe(sa, compose(_.lensAsOptional(_.atRecord<A>().at(key))))

/**
 * Return a `Optional` from a `Optional` focused on the `Some` of a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Optional<S, Option<A>>) => Optional<S, A> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismSome()))

/**
 * Return a `Optional` from a `Optional` focused on the `Right` of a `Either` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const right: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, A> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismRight()))

/**
 * Return a `Optional` from a `Optional` focused on the `Left` of a `Either` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const left: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, E> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismLeft()))

/**
 * Return a `Traversal` from a `Optional` focused on a `Traversable`
 *
 * @category combinators
 * @since 2.3.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Optional<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalComposeTraversal(_.fromTraversable(T)()))
}

/**
 * @category combinators
 * @since 2.3.2
 */
export const findFirst: <A>(predicate: Predicate<A>) => <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A> =
  /*#__PURE__*/
  flow(_.findFirst, compose)

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

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => ({
  getOption: flow(ea.getOption, O.map(ab)),
  set: flow(ba, ea.set)
})

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
export const invariantOptional: Invariant2<URI> = {
  URI,
  imap: imap_
}

/**
 * @category instances
 * @since 2.3.0
 */
export const categoryOptional: Category2<URI> = {
  URI,
  compose: (ab, ea) => compose(ab)(ea),
  id
}
