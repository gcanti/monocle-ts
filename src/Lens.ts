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
 * 1. get(set(a)(s)) = a
 * 2. set(get(s))(s) = s
 * 3. set(a)(set(a)(s)) = set(a)(s)
 *
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { flow } from 'fp-ts/lib/function'
import { Kind, URIS } from 'fp-ts/lib/HKT'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import { Option } from 'fp-ts/lib/Option'
import { Either } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { Traversable1 } from 'fp-ts/lib/Traversable'
import * as _ from './internal'
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
 * @since 2.3.0
 */
export const id: <S>() => Lens<S, S> = _.lensId

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Lens` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional: <S, A>(sa: Lens<S, A>) => Optional<S, A> = _.lensAsOptional

/**
 * View a `Lens` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal: <S, A>(sa: Lens<S, A>) => Traversal<S, A> = _.lensAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Lens` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B> = _.lensComposeLens

/**
 * Compose a `Lens` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B> = _.lensComposePrism

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 2.3.0
 */
export const modify = <A>(f: (a: A) => A) => <S>(lens: Lens<S, A>) => (s: S): S => {
  const o = lens.get(s)
  const n = f(o)
  return o === n ? s : lens.set(n)(s)
}

/**
 * Return a `Optional` from a `Lens` focused on a nullable value
 *
 * @category constructors
 * @since 2.3.0
 */
export const fromNullable = <S, A>(sa: Lens<S, A>): Optional<S, NonNullable<A>> =>
  _.lensComposePrism(_.prismFromNullable<A>())(sa)

/**
 * Return a `Lens` from a `Lens` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop: <A, P extends keyof A>(prop: P) => <S>(lens: Lens<S, A>) => Lens<S, A[P]> = _.lensProp

/**
 * Return a `Lens` from a `Lens` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props: <A, P extends keyof A>(
  ...props: [P, P, ...Array<P>]
) => <S>(lens: Lens<S, A>) => Lens<S, { [K in P]: A[K] }> = _.lensProps

/**
 * Return a `Lens` from a `Lens` and a component
 *
 * @category combinators
 * @since 2.3.0
 */
export const component: <A extends ReadonlyArray<unknown>, P extends keyof A>(
  prop: P
) => <S>(sa: Lens<S, A>) => Lens<S, A[P]> = _.lensComponent

/**
 * Return a `Optional` from a `Lens` focused on a `ReadonlyArray`
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number) => <S, A>(sa: Lens<S, ReadonlyArray<A>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.indexArray<A>().index(i)))

/**
 * Return a `Optional` from a `Lens` focused on a `ReadonlyRecord` and a key
 *
 * @category combinators
 * @since 2.3.0
 */
export const key = (key: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.indexRecord<A>().index(key)))

/**
 * Return a `Lens` from a `Lens` focused on a `ReadonlyRecord` and a required key
 *
 * @category combinators
 * @since 2.3.0
 */
export const atKey = (key: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>): Lens<S, Option<A>> =>
  pipe(sa, compose(_.atRecord<A>().at(key)))

/**
 * Return a `Optional` from a `Lens` focused on the `Some` of a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Lens<S, Option<A>>) => Optional<S, A> = composePrism(_.prismSome())

/**
 * Return a `Optional` from a `Lens` focused on the `Right` of a `Either` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const right: <S, E, A>(soa: Lens<S, Either<E, A>>) => Optional<S, A> = composePrism(_.prismRight())

/**
 * Return a `Optional` from a `Lens` focused on the `Left` of a `Either` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const left: <S, E, A>(soa: Lens<S, Either<E, A>>) => Optional<S, E> = composePrism(_.prismLeft())

/**
 * Return a `Traversal` from a `Lens` focused on a `Traversable`
 *
 * @category combinators
 * @since 2.3.0
 */
export function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Lens<S, Kind<T, A>>) => Traversal<S, A> {
  return flow(asTraversal, _.traversalComposeTraversal(_.fromTraversable(T)()))
}

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Lens<E, A>) => Lens<E, B> = (f, g) => (ea) =>
  imap_(ea, f, g)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

const imap_: Invariant2<URI>['imap'] = (ea, ab, ba) => ({
  get: flow(ea.get, ab),
  set: flow(ba, ea.set)
})

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
