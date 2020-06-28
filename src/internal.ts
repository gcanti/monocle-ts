/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.3.0
 */
import { Applicative } from 'fp-ts/lib/Applicative'
import * as A from 'fp-ts/lib/Array' // TODO: replace with ReadonlyArray in v3
import * as R from 'fp-ts/lib/Record' // TODO: replace with ReadonlyRecord in v3
import { constant, flow, identity, Predicate } from 'fp-ts/lib/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { Traversable, Traversable1, Traversable2, Traversable3 } from 'fp-ts/lib/Traversable'
import { Iso } from './Iso'
import { Index } from './Ix'
import { Lens } from './Lens'
import { Optional } from './Optional'
import { Prism } from './Prism'
import { Traversal } from './Traversal'
import { At } from './At'

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
  modifyF: <F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) => F.map(f(sa.get(s)), (a) => sa.set(a)(s))
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
export const lensProps = <A, P extends keyof A>(...props: [P, P, ...Array<P>]) => <S>(
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
    const copy: A = oa.slice() as any
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
        (a) => F.map(f(a), (a: A) => sa.set(a)(s))
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

// -------------------------------------------------------------------------------------
// Traversal
// -------------------------------------------------------------------------------------

/** @internal */
export function traversalComposeTraversal<A, B>(ab: Traversal<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return (sa) => ({
    modifyF: <F>(F: Applicative<F>) => (f: (a: B) => HKT<F, B>) => sa.modifyF(F)(ab.modifyF(F)(f))
  })
}

export function fromTraversable<T extends URIS3>(T: Traversable3<T>): <R, E, A>() => Traversal<Kind3<T, R, E, A>, A>
export function fromTraversable<T extends URIS2>(T: Traversable2<T>): <E, A>() => Traversal<Kind2<T, E, A>, A>
export function fromTraversable<T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Kind<T, A>, A>
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
/** @internal */
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A> {
  return <A>() => ({
    modifyF: <F>(F: Applicative<F>) => {
      const traverseF = T.traverse(F)
      return (f: (a: A) => HKT<F, A>) => (s: HKT<T, A>) => traverseF(s, f)
    }
  })
}

// -------------------------------------------------------------------------------------
// Ix
// -------------------------------------------------------------------------------------

function indexMutableArray<A = never>(): Index<Array<A>, number, A> {
  return {
    index: (i) => ({
      getOption: (as) => A.lookup(i, as),
      set: (a) => (as) =>
        pipe(
          A.updateAt(i, a)(as),
          O.getOrElse(() => as)
        )
    })
  }
}

/** @internal */
export const indexArray: <A = never>() => Index<ReadonlyArray<A>, number, A> = indexMutableArray as any

/** @internal */
export function indexRecord<A = never>(): Index<Readonly<Record<string, A>>, string, A> {
  return {
    index: (k) => ({
      getOption: (r) => R.lookup(k, r),
      set: (a) => (r) => {
        if (r[k] === a || O.isNone(R.lookup(k, r))) {
          return r
        }
        return R.insertAt(k, a)(r)
      }
    })
  }
}

/** @internal */
export function atRecord<A = never>(): At<Readonly<Record<string, A>>, string, O.Option<A>> {
  return {
    at: (key) => ({
      get: (r) => R.lookup(key, r),
      set: O.fold(
        () => R.deleteAt(key),
        (a) => R.insertAt(key, a)
      )
    })
  }
}
