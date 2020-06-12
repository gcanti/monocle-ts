/**
 * @since 2.3.0
 */
import { Applicative } from 'fp-ts/lib/Applicative'
import { constant, flow, identity, Refinement, Predicate } from 'fp-ts/lib/function'
import { HKT } from 'fp-ts/lib/HKT'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Iso } from './Iso'
import { Lens } from './Lens'
import { Optional } from './Optional'
import { Prism } from './Prism'
import { Traversal } from './Traversal'

// -------------------------------------------------------------------------------------
// Iso
// -------------------------------------------------------------------------------------

/** @internal */
export const isoAsLens = <S, A>(sa: Iso<S, A>): Lens<S, A> => ({
  get: sa.get,
  set: flow(sa.reverseGet, constant)
})

/** @internal */
export const isoAsPrism = <S, A>(sa: Iso<S, A>): Prism<S, A> => ({
  getOption: flow(sa.get, O.some),
  reverseGet: sa.reverseGet
})

/** @internal */
export const isoAsOptional = <S, A>(sa: Iso<S, A>): Optional<S, A> => ({
  getOption: flow(sa.get, O.some),
  set: flow(sa.reverseGet, constant)
})

/** @internal */
export const isoAsTraversal = <S, A>(sa: Iso<S, A>): Traversal<S, A> => ({
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) => F.map(f(sa.get(s)), (a) => sa.reverseGet(a))
})

/** @internal */
export const isoComposeIso = <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>): Iso<S, B> => ({
  get: flow(sa.get, ab.get),
  reverseGet: flow(ab.reverseGet, sa.reverseGet)
})

/** @internal */
export const isoComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Iso<S, A>): Lens<S, B> =>
  lensComposeLens(ab)(isoAsLens(sa))

/** @internal */
export const isoComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Iso<S, A>): Prism<S, B> =>
  prismComposePrism(ab)(isoAsPrism(sa))

/** @internal */
export const isoComposeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Iso<S, A>): Optional<S, B> =>
  optionalComposeOptional(ab)(isoAsOptional(sa))

/** @internal */
export const isoComposeTraversal = <A, B>(ab: Traversal<A, B>) => <S>(sa: Iso<S, A>): Traversal<S, B> =>
  traversalComposeTraversal(ab)(isoAsTraversal(sa))

// -------------------------------------------------------------------------------------
// Lens
// -------------------------------------------------------------------------------------

/** @internal */
export const lensAsOptional = <S, A>(sa: Lens<S, A>): Optional<S, A> => ({
  getOption: flow(sa.get, O.some),
  set: sa.set
})

/** @internal */
export const lensAsTraversal = <S, A>(sa: Lens<S, A>): Traversal<S, A> => ({
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) => F.map(f(sa.get(s)), (a) => sa.set(a)(s))
})

/** @internal */
export const lensComposeIso = <A, B>(ab: Iso<A, B>) => <S>(sa: Lens<S, A>): Lens<S, B> =>
  lensComposeLens(isoAsLens(ab))(sa)

/** @internal */
export const lensComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>): Lens<S, B> => ({
  get: (s) => ab.get(sa.get(s)),
  set: (b) => (s) => sa.set(ab.set(b)(sa.get(s)))(s)
})

/** @internal */
export const lensComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>): Optional<S, B> =>
  optionalComposeOptional(prismAsOptional(ab))(lensAsOptional(sa))

/** @internal */
export const lensComposeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Lens<S, A>): Optional<S, B> =>
  optionalComposeOptional(ab)(lensAsOptional(sa))

/** @internal */
export const lensComposeTraversal = <A, B>(ab: Traversal<A, B>) => <S>(sa: Lens<S, A>): Traversal<S, B> =>
  traversalComposeTraversal(ab)(lensAsTraversal(sa))

/** @internal */
export const lensId = <S>(): Lens<S, S> => ({
  get: identity,
  set: constant
})

/** @internal */
export const lensProp = <A, P extends keyof A>(prop: P) => <S>(lens: Lens<S, A>): Lens<S, A[P]> => ({
  get: (s) => lens.get(s)[prop],
  set: (a) => (s) => (a === lens.get(s)[prop] ? s : Object.assign({}, s, { [prop]: a }))
})

/** @internal */
export const lensProps = <A, P extends keyof A>(...props: Array<P>) => <S>(
  lens: Lens<S, A>
): Lens<S, { [K in P]: A[K] }> => ({
  get: (s) => {
    const a = lens.get(s)
    const r: { [K in P]?: A[K] } = {}
    for (const k of props) {
      r[k] = a[k]
    }
    return r as any
  },
  set: (a) => (s) => {
    const oa = lens.get(s)
    for (const k of props) {
      if (a[k] !== oa[k]) {
        return Object.assign({}, s, a)
      }
    }
    return s
  }
})

// -------------------------------------------------------------------------------------
// Prism
// -------------------------------------------------------------------------------------

/** @internal */
export const prismAsOptional = <S, A>(sa: Prism<S, A>): Optional<S, A> => ({
  getOption: sa.getOption,
  set: (a) => prismSet(a)(sa)
})

/** @internal */
export const prismAsTraversal = <S, A>(sa: Prism<S, A>): Traversal<S, A> => ({
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      sa.getOption(s),
      O.fold(
        () => F.of(s),
        (a) => F.map(f(a), (a) => prismSet(a)(sa)(s))
      )
    )
})

/** @internal */
export const prismModifyOption = <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S): O.Option<S> =>
  pipe(
    sa.getOption(s),
    O.map((o) => {
      const n = f(o)
      return n === o ? s : sa.reverseGet(n)
    })
  )

/** @internal */
export const prismModify = <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>): ((s: S) => S) => {
  const g = prismModifyOption(f)(sa)
  return (s) =>
    pipe(
      g(s),
      O.getOrElse(() => s)
    )
}

/** @internal */
export const prismSet = <A>(a: A): (<S>(sa: Prism<S, A>) => (s: S) => S) => prismModify(() => a)

/** @internal */
export const prismComposeIso = <A, B>(ab: Iso<A, B>) => <S>(sa: Prism<S, A>): Prism<S, B> =>
  prismComposePrism(isoAsPrism(ab))(sa)

/** @internal */
export const prismComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>): Prism<S, B> => ({
  getOption: flow(sa.getOption, O.chain(ab.getOption)),
  reverseGet: flow(ab.reverseGet, sa.reverseGet)
})

/** @internal */
export const prismComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>): Optional<S, B> =>
  optionalComposeOptional(lensAsOptional(ab))(prismAsOptional(sa))

/** @internal */
export const prismComposeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Prism<S, A>): Optional<S, B> =>
  optionalComposeOptional(ab)(prismAsOptional(sa))

/** @internal */
export const prismComposeTraversal = <A, B>(ab: Traversal<A, B>) => <S>(sa: Prism<S, A>): Traversal<S, B> =>
  traversalComposeTraversal(ab)(prismAsTraversal(sa))

/** @internal */
export const prismfromNullable = <A>(): Prism<A, NonNullable<A>> => ({
  getOption: O.fromNullable,
  reverseGet: identity
})

/** @internal */
export const prismProp = <A, P extends keyof A>(prop: P): (<S>(sa: Prism<S, A>) => Optional<S, A[P]>) =>
  prismComposeLens(pipe(lensId<A>(), lensProp(prop)))

/** @internal */
export const prismProps = <A, P extends keyof A>(
  ...props: Array<P>
): (<S>(sa: Prism<S, A>) => Optional<S, { [K in P]: A[K] }>) => prismComposeLens(pipe(lensId<A>(), lensProps(...props)))

export function prismFromPredicate<S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
export function prismFromPredicate<A>(predicate: Predicate<A>): Prism<A, A>
/** @internal */
export function prismFromPredicate<A>(predicate: Predicate<A>): Prism<A, A> {
  return {
    getOption: (s) => (predicate(s) ? O.some(s) : O.none),
    reverseGet: identity
  }
}

// -------------------------------------------------------------------------------------
// Optional
// -------------------------------------------------------------------------------------

/** @internal */
export const optionalAsTraversal = <S, A>(sa: Optional<S, A>): Traversal<S, A> => ({
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) => {
    const oa = sa.getOption(s)
    if (O.isNone(oa)) {
      return F.of(s)
    } else {
      return F.map(f(oa.value), (a: A) => sa.set(a)(s))
    }
  }
})

/** @internal */
export const optionalModifyOption = <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S): O.Option<S> =>
  pipe(
    optional.getOption(s),
    O.map((a) => {
      const n = f(a)
      return n === a ? s : optional.set(n)(s)
    })
  )

/** @internal */
export const optionalModify = <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>): ((s: S) => S) => {
  const g = optionalModifyOption(f)(optional)
  return (s) =>
    pipe(
      g(s),
      O.getOrElse(() => s)
    )
}

/** @internal */
export const optionalComposeIso = <A, B>(ab: Iso<A, B>) => <S>(sa: Optional<S, A>): Optional<S, B> =>
  optionalComposeOptional(isoAsOptional(ab))(sa)

/** @internal */
export const optionalComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Optional<S, A>): Optional<S, B> =>
  optionalComposeOptional(lensAsOptional(ab))(sa)

/** @internal */
export const optionalComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Optional<S, A>): Optional<S, B> =>
  optionalComposeOptional(prismAsOptional(ab))(sa)

/** @internal */
export const optionalComposeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>): Optional<S, B> => ({
  getOption: flow(sa.getOption, O.chain(ab.getOption)),
  set: (b) => optionalModify(ab.set(b))(sa)
})

/** @internal */
export const optionalComposeTraversal = <A, B>(ab: Traversal<A, B>) => <S>(sa: Optional<S, A>): Traversal<S, B> =>
  traversalComposeTraversal(ab)(optionalAsTraversal(sa))

/** @internal */
export const optionalProp = <A, P extends keyof A>(prop: P): (<S>(sa: Optional<S, A>) => Optional<S, A[P]>) =>
  optionalComposeLens(pipe(lensId<A>(), lensProp(prop)))

/** @internal */
export const optionalProps = <A, P extends keyof A>(
  ...props: Array<P>
): (<S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>) =>
  optionalComposeLens(pipe(lensId<A>(), lensProps(...props)))

// -------------------------------------------------------------------------------------
// Traversal
// -------------------------------------------------------------------------------------

/** @internal */
export function traversalComposeIso<A, B>(ab: Iso<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return traversalComposeTraversal(isoAsTraversal(ab))
}

/** @internal */
export function traversalComposeLens<A, B>(ab: Lens<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return traversalComposeTraversal(lensAsTraversal(ab))
}

/** @internal */
export function traversalComposePrism<A, B>(ab: Prism<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return traversalComposeTraversal(prismAsTraversal(ab))
}

/** @internal */
export function traversalComposeOptional<A, B>(ab: Optional<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return traversalComposeTraversal(optionalAsTraversal(ab))
}

/** @internal */
export function traversalComposeTraversal<A, B>(ab: Traversal<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return (sa) => ({
    modifyF: <F>(F: Applicative<F>) => (f: (a: B) => HKT<F, B>) => sa.modifyF(F)(ab.modifyF(F)(f))
  })
}

/** @internal */
export const traversalProp = <A, P extends keyof A>(prop: P): (<S>(sa: Traversal<S, A>) => Traversal<S, A[P]>) =>
  traversalComposeLens(pipe(lensId<A>(), lensProp(prop)))

/** @internal */
export const traversalProps = <A, P extends keyof A>(
  ...props: Array<P>
): (<S>(sa: Traversal<S, A>) => Traversal<S, { [K in P]: A[K] }>) =>
  traversalComposeLens(pipe(lensId<A>(), lensProps(...props)))
