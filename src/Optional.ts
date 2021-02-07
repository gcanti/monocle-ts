/**
 * An `Optional` is an optic used to zoom inside a product. Unlike the `Lens`, the element that the `Optional` focuses
 * on may not exist.
 *
 * `Optional`s have two type parameters generally called `S` and `A`: `Optional<S, A>` where `S` represents the product
 * and `A` an optional element inside of `S`.
 *
 * Laws:
 *
 * 1. pipe(getOption(s), fold(() => s, a => set(a)(s))) = s
 * 2. getOption(set(a)(s)) = pipe(getOption(s), map(_ => a))
 * 3. set(a)(set(a)(s)) = set(a)(s)
 *
 * @since 3.0.0
 */
import { Category2 } from 'fp-ts/Category'
import { Either } from 'fp-ts/Either'
import { constant, flow, pipe, Predicate, Refinement } from 'fp-ts/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/HKT'
import { Invariant2 } from 'fp-ts/Invariant'
import { Applicative, Applicative1, Applicative2, Applicative3 } from 'fp-ts/Applicative'
import * as O from 'fp-ts/Option'
import { Traversable1 } from 'fp-ts/Traversable'
import * as _ from './internal'
import { Traversal } from './Traversal'

import Option = O.Option

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export interface Optional<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly replace: (a: A) => (s: S) => S
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const id = <S>(): Optional<S, S> => ({
  getOption: O.some,
  replace: constant
})

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Optional` as a `Traversal`.
 *
 * @category converters
 * @since 3.0.0
 */
export const asTraversal: <S, A>(sa: Optional<S, A>) => Traversal<S, A> = _.optionalAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Optional` with a `Optional`.
 *
 * @category compositions
 * @since 3.0.0
 */
export const compose: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  _.optionalComposeOptional

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 3.0.0
 */
export const modifyOption: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => Option<S> =
  _.optionalModifyOption

/**
 * @category combinators
 * @since 3.0.0
 */
export const modify: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => S = _.optionalModify

/**
 * @category combinators
 * @since 3.0.0
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
        flow(
          f,
          F.map((a) => sa.replace(a)(s))
        )
      )
    )
}

/**
 * Return an `Optional` from a `Optional` focused on a nullable value
 *
 * @category combinators
 * @since 3.0.0
 */
export const fromNullable: <S, A>(sa: Optional<S, A>) => Optional<S, NonNullable<A>> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismFromNullable()))

/**
 * @category combinators
 * @since 3.0.0
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
 * @since 3.0.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensProp(prop), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` and a list of props.
 *
 * @category combinators
 * @since 3.0.0
 */
export const props = <A, P extends keyof A>(
  ...props: readonly [P, P, ...ReadonlyArray<P>]
): (<S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>) =>
  compose(pipe(_.lensId<A>(), _.lensProps(...props), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` and a component.
 *
 * @category combinators
 * @since 3.0.0
 */
export const component = <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  compose(pipe(_.lensId<A>(), _.lensComponent(prop), _.lensAsOptional))

/**
 * Return a `Optional` from a `Optional` focused on a `ReadonlyArray`.
 *
 * @category combinators
 * @since 3.0.0
 */
export const index = (i: number) => <S, A>(sa: Optional<S, ReadonlyArray<A>>): Optional<S, A> =>
  pipe(sa, _.optionalComposeOptional(_.indexReadonlyArray<A>().index(i)))

/**
 * Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a key.
 *
 * @category combinators
 * @since 3.0.0
 */
export const key = (key: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>): Optional<S, A> =>
  pipe(sa, _.optionalComposeOptional(_.indexReadonlyRecord<A>().index(key)))

/**
 * Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a required key.
 *
 * @category combinators
 * @since 3.0.0
 */
export const atKey = (key: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>): Optional<S, Option<A>> =>
  pipe(sa, compose(_.lensAsOptional(_.atReadonlyRecord<A>().at(key))))

/**
 * Return a `Optional` from a `Optional` focused on the `Some` of a `Option` type.
 *
 * @category combinators
 * @since 3.0.0
 */
export const some: <S, A>(soa: Optional<S, Option<A>>) => Optional<S, A> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismSome()))

/**
 * Return a `Optional` from a `Optional` focused on the `Right` of a `Either` type.
 *
 * @category combinators
 * @since 3.0.0
 */
export const right: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, A> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismRight()))

/**
 * Return a `Optional` from a `Optional` focused on the `Left` of a `Either` type.
 *
 * @category combinators
 * @since 3.0.0
 */
export const left: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, E> =
  /*#__PURE__*/
  compose(_.prismAsOptional(_.prismLeft()))

/**
 * Return a `Traversal` from a `Optional` focused on a `Traversable`.
 *
 * @category combinators
 * @since 3.0.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Optional<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalComposeTraversal(_.fromTraversable(T)()))
}

/**
 * @category combinators
 * @since 3.0.0
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, B>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A>
export function findFirst<A>(predicate: Predicate<A>): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A> {
  return compose(_.findFirst(predicate))
}

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 3.0.0
 */
export const imap: Invariant2<URI>['imap'] = (f, g) => (ea) => ({
  getOption: flow(ea.getOption, O.map(f)),
  replace: flow(g, ea.replace)
})

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export type URI = 'monocle-ts/Optional'

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly 'monocle-ts/Optional': Optional<E, A>
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Invariant: Invariant2<URI> = {
  imap
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Category: Category2<URI> = {
  compose,
  id
}
