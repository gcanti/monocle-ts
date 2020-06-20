/**
 * A `Prism` is an optic used to select part of a sum type.
 *
 * Laws:
 *
 * 1. getOption(s).fold(s, reverseGet) = s
 * 2. getOption(reverseGet(a)) = Some(a)
 *
 * @since 2.3.0
 */
import { Category2 } from 'fp-ts/lib/Category'
import { flow, identity, Predicate, Refinement } from 'fp-ts/lib/function'
import { Invariant2 } from 'fp-ts/lib/Invariant'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
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

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromSome: <A>() => Prism<Option<A>, A> = _.prismFromSome

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromNullable: <A>() => Prism<A, NonNullable<A>> = _.prismFromNullable

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

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

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
 * @since 2.3.0
 */
export const set: <A>(a: A) => <S>(sa: Prism<S, A>) => (s: S) => S = _.prismSet

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

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
 * Return a `Optional` from a `Prism` focused on a `ReadonlyRecord`
 *
 * @category combinators
 * @since 2.3.0
 */
export const key = (k: string) => <S, A>(sa: Prism<S, Readonly<Record<string, A>>>): Optional<S, A> =>
  pipe(sa, asOptional, _.optionalComposeOptional(_.indexRecord<A>().index(k)))

/**
 * Return a `Prism` from a `Prism` focused on a `Option` type
 *
 * @category combinators
 * @since 2.3.0
 */
export const some: <S, A>(soa: Prism<S, Option<A>>) => Prism<S, A> = compose(_.prismFromSome())

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

/**
 * @category Invariant
 * @since 2.3.0
 */
export const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Prism<E, A>) => Prism<E, B> = (f, g) => (ea) =>
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
