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
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { Option } from 'fp-ts/lib/Option'
import { Semigroupoid2 } from 'fp-ts/lib/Semigroupoid'
import * as _ from './internal'
import { Iso } from './Iso'
import { Optional } from './Optional'
import { Prism } from './Prism'
import { Traversal } from './Traversal'
import { URIS, Kind } from 'fp-ts/lib/HKT'
import { Traversable1 } from 'fp-ts/lib/Traversable'

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
 * Compose a `Lens` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B> = _.lensComposeIso

/**
 * Compose a `Lens` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B> = _.lensComposeLens

/**
 * Compose a `Lens` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B> = _.lensComposePrism

/**
 * Compose a `Lens` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B> =
  _.lensComposeOptional

/**
 * Compose a `Lens` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Lens<S, A>) => Traversal<S, B> =
  _.lensComposeTraversal

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
export const fromNullable: <S, A>(sa: Lens<S, A>) => Optional<S, NonNullable<A>> = _.lensFromNullable

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
export const props: <A, P extends keyof A>(...props: P[]) => <S>(lens: Lens<S, A>) => Lens<S, { [K in P]: A[K] }> =
  _.lensProps

/**
 * Return a `Optional` from a `Lens` focused on a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Lens<S, Option<A>>) => Optional<S, A> = composePrism(_.prismFromSome())

/**
 * Return a `Traversal` from a `Lens` focused on a `Traversable`
 *
 * @category combinators
 * @since 2.3.0
 */
export const traverse = <T extends URIS>(T: Traversable1<T>) => <S, A>(sta: Lens<S, Kind<T, A>>): Traversal<S, A> =>
  composeTraversal(_.fromTraversable(T)<A>())(sta)

/**
 * Return a `Optional` from a `Lens` focused on a `ReadonlyArray`
 *
 * @category combinators
 * @since 2.3.0
 */
export const index = (i: number) => <S, A>(sa: Lens<S, ReadonlyArray<A>>): Optional<S, A> =>
  composeOptional(_.indexReadonlyArray<A>().index(i))(sa)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

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

const compose_: Semigroupoid2<URI>['compose'] = (ab, ea) => composeLens(ab)(ea)

/**
 * @category instances
 * @since 2.3.0
 */
export const semigroupoidLens: Semigroupoid2<URI> = {
  URI,
  compose: compose_
}

/**
 * @category instances
 * @since 2.3.0
 */
export const categoryLens: Category2<URI> = {
  URI,
  compose: compose_,
  id
}
