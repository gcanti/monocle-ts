/**
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
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'
import { Prism } from './Prism'
import { Traversal } from './Traversal'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

import Option = O.Option
import { Category2 } from 'fp-ts/lib/Category'
import { constant, flow } from 'fp-ts/lib/function'
import { Invariant2 } from 'fp-ts/lib/Invariant'

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
 * Compose a `Optional` with an `Iso`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> = _.optionalComposeIso

/**
 * Compose a `Optional` with a `Lens`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> = _.optionalComposeLens

/**
 * Compose a `Optional` with a `Prism`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> = _.optionalComposePrism

/**
 * Compose a `Optional` with a `Optional`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B> =
  _.optionalComposeOptional

/**
 * Compose a `Optional` with a `Traversal`
 *
 * @category compositions
 * @since 2.3.0
 */
export const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Optional<S, A>) => Traversal<S, B> =
  _.optionalComposeTraversal

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
 * Return a `Optional` from a `Optional` and a prop
 *
 * @category combinators
 * @since 2.3.0
 */
export const prop = <A, P extends keyof A>(prop: P): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  composeLens(pipe(_.lensId<A>(), _.lensProp(prop)))

/**
 * Return a `Optional` from a `Optional` and a list of props
 *
 * @category combinators
 * @since 2.3.0
 */
export const props = <A, P extends keyof A>(
  ...props: P[]
): (<S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>) =>
  composeLens(pipe(_.lensId<A>(), _.lensProps(...props)))

/**
 * Return a `Optional` from a `Optional` focused on a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Optional<S, Option<A>>) => Optional<S, A> = composePrism(_.prismFromSome())

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
  compose: (ab, ea) => composeOptional(ab)(ea),
  id
}
