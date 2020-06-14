/**
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
import { Predicate, Refinement } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import { identity } from 'fp-ts/lib/Identity'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Traversable1 } from 'fp-ts/lib/Traversable'
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
 * @since 2.3.0
 */
export const id = <S>(): Traversal<S, S> => ({
  modifyF: <F>(_: Applicative<F>) => (f: (s: S) => HKT<F, S>) => f
})

/**
 * Create a `Traversal` from a `Traversable`
 *
 * @category constructor
 * @since 2.3.0
 */
export const fromTraversable = _.fromTraversable

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Traversal` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> = _.traversalComposeIso

/**
 * Compose a `Traversal` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> = _.traversalComposeLens

/**
 * Compose a `Traversal` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  _.traversalComposePrism

/**
 * Compose a `Traversal` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  _.traversalComposeOptional

/**
 * Compose a `Traversal` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B> =
  _.traversalComposeTraversal

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = <A>(f: (a: A) => A) => <S>(sa: Traversal<S, A>): ((s: S) => S) => {
  return sa.modifyF(identity)(f)
}

/**
 * @category combinators
 * @since 2.3.0
 */
export const set = <A>(a: A): (<S>(sa: Traversal<S, A>) => (s: S) => S) => {
  return modify(() => a)
}

/**
 * @category combinators
 * @since 2.3.0
 */
export function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(traversal: Traversal<S, A>) => Traversal<S, B>
export function filter<A>(predicate: Predicate<A>): <S>(traversal: Traversal<S, A>) => Traversal<S, A>
export function filter<A>(predicate: Predicate<A>): <S>(traversal: Traversal<S, A>) => Traversal<S, A> {
  return composePrism(_.prismFromPredicate(predicate))
}

/**
 * Return a `Traversal` from a `Traversal` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Traversal<S, A>) => Traversal<S, A[P]>) =>
  composeLens(pipe(_.lensId<A>(), _.lensProp(prop)))

/**
 * Return a `Traversal` from a `Traversal` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = <A, P extends keyof A>(
  ...props: P[]
): (<S>(sa: Traversal<S, A>) => Traversal<S, { [K in P]: A[K] }>) =>
  composeLens(pipe(_.lensId<A>(), _.lensProps(...props)))

/**
 * Return a `Traversal` from a `Traversal` focused on a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Traversal<S, Option<A>>) => Traversal<S, A> = composePrism(_.prismFromSome())

/**
 * Return a `Traversal` from a `Traversal` focused on a `Traversable`
 *
 * @category combinators
 * @since 2.3.0
 */
export const traverse = <T extends URIS>(T: Traversable1<T>) => <S, A>(
  sta: Traversal<S, Kind<T, A>>
): Traversal<S, A> => composeTraversal(fromTraversable(T)<A>())(sta)

/**
 * Return a `Traversal` from a `Traversal` focused on a `ReadonlyArray`
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number) => <S, A>(sa: Traversal<S, ReadonlyArray<A>>): Traversal<S, A> =>
  composeOptional(_.indexReadonlyArray<A>().index(i))(sa)

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
 * @since 2.3.0
 */
export const categoryTraversal: Category2<URI> = {
  URI,
  compose: (ab, ea) => composeTraversal(ab)(ea),
  id
}
