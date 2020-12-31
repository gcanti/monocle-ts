/**
 * A `Lens` is an optic used to zoom inside a product.
 *
 * `Lens`es have two type parameters generally called `S` and `A`: `Lens<S, A>` where `S` represents the product and `A`
 * an element inside of `S`.
 *
 * Laws:
 *
 * 1. get(set(a)(s)) = a
 * 2. set(get(s))(s) = s
 * 3. set(a)(set(a)(s)) = set(a)(s)
 *
 * @since 3.0.0
 */
import { Category2 } from 'fp-ts/Category'
import { Either } from 'fp-ts/Either'
import { flow, pipe, Predicate, Refinement } from 'fp-ts/function'
import { Kind, URIS } from 'fp-ts/HKT'
import { Invariant2 } from 'fp-ts/Invariant'
import { Option } from 'fp-ts/Option'
import { Traversable1 } from 'fp-ts/Traversable'
import * as _ from './internal'
import { Optional } from './Optional'
import { Prism } from './Prism'
import { Traversal } from './Traversal'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export interface Lens<S, A> {
  readonly get: (s: S) => A
  readonly set: (a: A) => (s: S) => S
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category Category
 * @since 3.0.0
 */
export const id: <S>() => Lens<S, S> = _.lensId

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Lens` as a `Optional`
 *
 * @category converters
 * @since 3.0.0
 */
export const asOptional: <S, A>(sa: Lens<S, A>) => Optional<S, A> = _.lensAsOptional

/**
 * View a `Lens` as a `Traversal`
 *
 * @category converters
 * @since 3.0.0
 */
export const asTraversal: <S, A>(sa: Lens<S, A>) => Traversal<S, A> = _.lensAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Lens` with a `Lens`
 *
 * @category Semigroupoid
 * @since 3.0.0
 */
export const compose: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B> = _.lensComposeLens

/**
 * Compose a `Lens` with a `Prism`
 *
 * @category compositions
 * @since 3.0.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B> = _.lensComposePrism

/**
 * Compose a `Lens` with an `Optional`
 *
 * @category compositions
 * @since 3.0.0
 */
export const composeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Lens<S, A>): Optional<S, B> =>
  _.optionalComposeOptional(ab)(asOptional(sa))

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 3.0.0
 */
export const modify = <A>(f: (a: A) => A) => <S>(sa: Lens<S, A>) => (s: S): S => {
  const o = sa.get(s)
  const n = f(o)
  return o === n ? s : sa.set(n)(s)
}

/**
 * Return a `Optional` from a `Lens` focused on a nullable value
 *
 * @category combinators
 * @since 3.0.0
 */
export const fromNullable = <S, A>(sa: Lens<S, A>): Optional<S, NonNullable<A>> =>
  _.lensComposePrism(_.prismFromNullable<A>())(sa)

/**
 * @category combinators
 * @since 3.0.0
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Lens<S, A>) => Optional<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Lens<S, A>) => Optional<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(sa: Lens<S, A>) => Optional<S, A> {
  return composePrism(_.prismFromPredicate(predicate))
}

/**
 * Return a `Lens` from a `Lens` and a prop
 *
 * @category combinators
 * @since 3.0.0
 */
export const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Lens<S, A>) => Lens<S, A[P]> = _.lensProp

/**
 * Return a `Lens` from a `Lens` and a list of props
 *
 * @category combinators
 * @since 3.0.0
 */
export const props: <A, P extends keyof A>(
  ...props: readonly [P, P, ...ReadonlyArray<P>]
) => <S>(sa: Lens<S, A>) => Lens<S, { [K in P]: A[K] }> = _.lensProps

/**
 * Return a `Lens` from a `Lens` and a component
 *
 * @category combinators
 * @since 3.0.0
 */
export const component: <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
) => <S>(sa: Lens<S, A>) => Lens<S, A[P]> = _.lensComponent

/**
 * Return a `Optional` from a `Lens` focused on a `ReadonlyArray`
 *
 * @category combinators
 * @since 3.0.0
 */
export const index = (i: number) => <S, A>(sa: Lens<S, ReadonlyArray<A>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.ixReadonlyArray<A>().ix(i)))

/**
 * Return a `Optional` from a `Lens` focused on a `ReadonlyRecord` and a key
 *
 * @category combinators
 * @since 3.0.0
 */
export const key = (key: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.ixReadonlyRecord<A>().ix(key)))

/**
 * Return a `Lens` from a `Lens` focused on a `ReadonlyRecord` and a required key
 *
 * @category combinators
 * @since 3.0.0
 */
export const atKey = (key: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>): Lens<S, Option<A>> =>
  pipe(sa, compose(_.atRecord<A>().at(key)))

/**
 * Return a `Optional` from a `Lens` focused on the `Some` of a `Option` type
 *
 * @category combinators
 * @since 3.0.0
 */
export const some: <S, A>(soa: Lens<S, Option<A>>) => Optional<S, A> =
  /*#__PURE__*/
  composePrism(_.prismSome())

/**
 * Return a `Optional` from a `Lens` focused on the `Right` of a `Either` type
 *
 * @category combinators
 * @since 3.0.0
 */
export const right: <S, E, A>(sea: Lens<S, Either<E, A>>) => Optional<S, A> =
  /*#__PURE__*/
  composePrism(_.prismRight())

/**
 * Return a `Optional` from a `Lens` focused on the `Left` of a `Either` type
 *
 * @category combinators
 * @since 3.0.0
 */
export const left: <S, E, A>(sea: Lens<S, Either<E, A>>) => Optional<S, E> =
  /*#__PURE__*/
  composePrism(_.prismLeft())

/**
 * Return a `Traversal` from a `Lens` focused on a `Traversable`
 *
 * @category combinators
 * @since 3.0.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Lens<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalComposeTraversal(_.fromTraversable(T)()))
}

/**
 * @category combinators
 * @since 3.0.0
 */
export const findFirst: <A>(predicate: Predicate<A>) => <S>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, A> =
  /*#__PURE__*/
  flow(_.findFirst, composeOptional)

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 3.0.0
 */
export const imap: Invariant2<URI>['imap'] = (f, g) => (ea) => ({
  get: flow(ea.get, f),
  set: flow(g, ea.set)
})

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 3.0.0
 */
export const URI = 'monocle-ts/Lens'

/**
 * @category instances
 * @since 3.0.0
 */
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    readonly [URI]: Lens<E, A>
  }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Invariant: Invariant2<URI> = {
  URI,
  imap
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Category: Category2<URI> = {
  URI,
  compose,
  id
}
