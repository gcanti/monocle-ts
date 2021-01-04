/**
 * @since 3.0.0
 */
import { Applicative } from 'fp-ts/Applicative'
import * as E from 'fp-ts/Either'
import { constant, flow, identity, pipe, Predicate } from 'fp-ts/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/HKT'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'
import * as R from 'fp-ts/ReadonlyRecord'
import { Traversable, Traversable1, Traversable2, Traversable3 } from 'fp-ts/Traversable'
import { At } from './At'
import { Iso } from './Iso'
import { Index } from './Ix'
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
export const isoAsOptional = <S, A>(sa: Iso<S, A>): Optional<S, A> => ({
  getOption: flow(sa.get, O.some),
  set: flow(sa.reverseGet, constant)
})

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
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      f(sa.get(s)),
      F.map((a) => sa.set(a)(s))
    )
})

/** @internal */
export const lensComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>): Lens<S, B> => ({
  get: (s) => ab.get(sa.get(s)),
  set: (b) => (s) => sa.set(ab.set(b)(sa.get(s)))(s)
})

/** @internal */
export const lensComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>): Optional<S, B> =>
  optionalComposeOptional(prismAsOptional(ab))(lensAsOptional(sa))

/** @internal */
export const lensId = <S>(): Lens<S, S> => ({
  get: identity,
  set: constant
})

/** @internal */
export const lensProp = <A, P extends keyof A>(prop: P) => <S>(lens: Lens<S, A>): Lens<S, A[P]> => ({
  get: (s) => lens.get(s)[prop],
  set: (ap) => (s) => {
    const oa = lens.get(s)
    if (ap === oa[prop]) {
      return s
    }
    return lens.set(Object.assign({}, oa, { [prop]: ap }))(s)
  }
})

/** @internal */
export const lensProps = <A, P extends keyof A>(...props: readonly [P, P, ...ReadonlyArray<P>]) => <S>(
  lens: Lens<S, A>
): Lens<S, { [K in P]: A[K] }> => ({
  get: (s) => {
    const a = lens.get(s)
    const r: { [K in P]?: A[K] } = {}
    for (const k of props) {
      r[k] = a[k]
    }
    return r as { [K in P]: A[K] }
  },
  set: (a) => (s) => {
    const oa = lens.get(s)
    for (const k of props) {
      if (a[k] !== oa[k]) {
        return lens.set(Object.assign({}, oa, a))(s)
      }
    }
    return s
  }
})

/** @internal */
export const lensComponent = <A extends ReadonlyArray<unknown>, P extends keyof A>(prop: P) => <S>(
  lens: Lens<S, A>
): Lens<S, A[P]> => ({
  get: (s) => lens.get(s)[prop],
  set: (ap) => (s) => {
    const oa = lens.get(s)
    if (ap === oa[prop]) {
      return s
    }
    const copy = (oa.slice() as unknown) as A
    copy[prop] = ap
    return lens.set(copy)(s)
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
        (a) =>
          pipe(
            f(a),
            F.map((a) => prismSet(a)(sa)(s))
          )
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
export const prismComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>): Optional<S, B> =>
  optionalComposeOptional(lensAsOptional(ab))(prismAsOptional(sa))

/** @internal */
export const prismFromNullable = <A>(): Prism<A, NonNullable<A>> => ({
  getOption: O.fromNullable,
  reverseGet: identity
})

/** @internal */
export function prismFromPredicate<A>(predicate: Predicate<A>): Prism<A, A> {
  return {
    getOption: O.fromPredicate(predicate),
    reverseGet: identity
  }
}

/** @internal */
export const prismSome = <A>(): Prism<O.Option<A>, A> => ({
  getOption: identity,
  reverseGet: O.some
})

/** @internal */
export const prismRight = <E, A>(): Prism<E.Either<E, A>, A> => ({
  getOption: O.fromEither,
  reverseGet: E.right
})

/** @internal */
export const prismLeft = <E, A>(): Prism<E.Either<E, A>, E> => ({
  getOption: (s) => (E.isLeft(s) ? O.some(s.left) : O.none), // TODO: replace with E.getLeft in v3
  reverseGet: E.left
})

// -------------------------------------------------------------------------------------
// Optional
// -------------------------------------------------------------------------------------

/** @internal */
export const optionalAsTraversal = <S, A>(sa: Optional<S, A>): Traversal<S, A> => ({
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      sa.getOption(s),
      O.fold(
        () => F.of(s),
        (a) =>
          pipe(
            f(a),
            F.map((a) => sa.set(a)(s))
          )
      )
    )
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
export const optionalComposeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>): Optional<S, B> => ({
  getOption: flow(sa.getOption, O.chain(ab.getOption)),
  set: (b) => optionalModify(ab.set(b))(sa)
})

/** @internal */
export const findFirst = <A>(predicate: Predicate<A>): Optional<ReadonlyArray<A>, A> => ({
  getOption: A.findFirst(predicate),
  set: (a) => (s) =>
    pipe(
      A.findIndex(predicate)(s),
      O.fold(
        () => s,
        (i) => {
          if (s[i] === a) {
            return s
          }
          const as = s.slice()
          as[i] = a
          return as
        }
      )
    )
})

// -------------------------------------------------------------------------------------
// Traversal
// -------------------------------------------------------------------------------------

/** @internal */
export function traversalComposeTraversal<A, B>(ab: Traversal<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return (sa) => ({
    modifyF: <F>(F: Applicative<F>) => (f: (a: B) => HKT<F, B>) => sa.modifyF(F)(ab.modifyF(F)(f))
  })
}

/** @internal */
export function fromTraversable<T extends URIS3>(T: Traversable3<T>): <R, E, A>() => Traversal<Kind3<T, R, E, A>, A>
export function fromTraversable<T extends URIS2>(T: Traversable2<T>): <E, A>() => Traversal<Kind2<T, E, A>, A>
export function fromTraversable<T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Kind<T, A>, A>
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
/** @internal */
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A> {
  return () => ({
    modifyF: <F>(F: Applicative<F>) => T.traverse(F)
  })
}

// -------------------------------------------------------------------------------------
// Ix
// -------------------------------------------------------------------------------------

/** @internal */
export const indexReadonlyArray = <A = never>(): Index<ReadonlyArray<A>, number, A> => ({
  index: (i) => ({
    getOption: A.lookup(i),
    set: (a) => (as) =>
      pipe(
        A.updateAt(i, a)(as),
        O.getOrElse(() => as)
      )
  })
})

/** @internal */
export function indexReadonlyRecord<A = never>(): Index<Readonly<Record<string, A>>, string, A> {
  return {
    index: (k) => ({
      getOption: R.lookup(k),
      set: (a) => (r) => {
        if (r[k] === a || O.isNone(R.lookup(k)(r))) {
          return r
        }
        return R.upsertAt(k, a)(r)
      }
    })
  }
}

// -------------------------------------------------------------------------------------
// At
// -------------------------------------------------------------------------------------

/** @internal */
export function atRecord<A = never>(): At<Readonly<Record<string, A>>, string, O.Option<A>> {
  return {
    at: (key) => ({
      get: R.lookup(key),
      set: O.fold(
        () => R.deleteAt(key),
        (a) => R.upsertAt(key, a)
      )
    })
  }
}
