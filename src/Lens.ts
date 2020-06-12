/**
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { Semigroupoid2 } from 'fp-ts/lib/Semigroupoid'
import * as I from './internal'
import { Optional } from './Optional'

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
export const id = I.lensId

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromNullable: <S, A>(sa: Lens<S, A>) => Optional<S, NonNullable<A>> =
  /*#__PURE__*/
  I.lensComposePrism(I.prismfromNullable())

// -------------------------------------------------------------------------------------
// converters
// -------------------------------------------------------------------------------------

/**
 * View a `Lens` as a `Optional`
 *
 * @category converters
 * @since 2.3.0
 */
export const asOptional = I.lensAsOptional

/**
 * View a `Lens` as a `Traversal`
 *
 * @category converters
 * @since 2.3.0
 */
export const asTraversal = I.lensAsTraversal

// -------------------------------------------------------------------------------------
// compositions
// -------------------------------------------------------------------------------------

/**
 * Compose a `Lens` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso = I.lensComposeIso

/**
 * Compose a `Lens` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const compose = I.lensComposeLens

/**
 * Compose a `Lens` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism = I.lensComposePrism

/**
 * Compose a `Lens` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional = I.lensComposeOptional

/**
 * Compose a `Lens` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal = I.lensComposeTraversal

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
 * Return a `Lens` from a `Lens` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = I.lensProp

/**
 * Return a `Lens` from a `Lens` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = I.lensProps

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

const compose_: Semigroupoid2<URI>['compose'] = (ab, ea) => compose(ab)(ea)

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
