/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.3.0
 */
import { Applicative } from 'fp-ts/Applicative'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import { constant, flow, identity, Predicate, pipe } from 'fp-ts/function'
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/HKT'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { Traversable, Traversable1, Traversable2, Traversable3 } from 'fp-ts/Traversable'
import { Iso } from './Iso'
import { Index } from './Ix'
import { Lens } from './Lens'
import { Optional } from './Optional'
import { Prism } from './Prism'
import { Traversal } from './Traversal'
import { At } from './At'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'

// -------------------------------------------------------------------------------------
// Iso
// -------------------------------------------------------------------------------------

/** @internal */
export const iso = <S, A>(get: Iso<S, A>['get'], reverseGet: Iso<S, A>['reverseGet']): Iso<S, A> => ({
  get,
  reverseGet
})

/** @internal */
export const isoAsLens = <S, A>(sa: Iso<S, A>): Lens<S, A> => lens(sa.get, flow(sa.reverseGet, constant))

/** @internal */
export const isoAsPrism = <S, A>(sa: Iso<S, A>): Prism<S, A> => prism(flow(sa.get, O.some), sa.reverseGet)

/** @internal */
export const isoAsOptional = <S, A>(sa: Iso<S, A>): Optional<S, A> =>
  optional(flow(sa.get, O.some), flow(sa.reverseGet, constant))

/** @internal */
export const isoAsTraversal = <S, A>(sa: Iso<S, A>): Traversal<S, A> =>
  traversal(<F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      f(sa.get(s)),
      F.map((a) => sa.reverseGet(a))
    )
  )

// -------------------------------------------------------------------------------------
// Lens
// -------------------------------------------------------------------------------------

/** @internal */
export const lens = <S, A>(get: Lens<S, A>['get'], set: Lens<S, A>['set']): Lens<S, A> => ({ get, set })

/** @internal */
export const lensAsOptional = <S, A>(sa: Lens<S, A>): Optional<S, A> => optional(flow(sa.get, O.some), sa.set)

/** @internal */
export const lensAsTraversal = <S, A>(sa: Lens<S, A>): Traversal<S, A> =>
  traversal(<F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      f(sa.get(s)),
      F.map((a) => sa.set(a)(s))
    )
  )

/** @internal */
export const lensComposeLens = <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>): Lens<S, B> =>
  lens(
    (s) => ab.get(sa.get(s)),
    (b) => (s) => sa.set(ab.set(b)(sa.get(s)))(s)
  )

/** @internal */
export const prismComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>): Prism<S, B> =>
  prism(flow(sa.getOption, O.chain(ab.getOption)), flow(ab.reverseGet, sa.reverseGet))

/** @internal */
export const lensComposePrism = <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>): Optional<S, B> =>
  optionalComposeOptional(prismAsOptional(ab))(lensAsOptional(sa))

/** @internal */
export const lensId = <S>(): Lens<S, S> => lens(identity, constant)

/** @internal */
export const lensProp = <A, P extends keyof A>(prop: P) => <S>(sa: Lens<S, A>): Lens<S, A[P]> =>
  lens(
    (s) => sa.get(s)[prop],
    (ap) => (s) => {
      const oa = sa.get(s)
      if (ap === oa[prop]) {
        return s
      }
      return sa.set(Object.assign({}, oa, { [prop]: ap }))(s)
    }
  )

/** @internal */
export const lensProps = <A, P extends keyof A>(...props: readonly [P, P, ...ReadonlyArray<P>]) => <S>(
  sa: Lens<S, A>
): Lens<S, { [K in P]: A[K] }> =>
  lens(
    (s) => {
      const a = sa.get(s)
      const r: { [K in P]?: A[K] } = {}
      for (const k of props) {
        r[k] = a[k]
      }
      return r as any
    },
    (a) => (s) => {
      const oa = sa.get(s)
      for (const k of props) {
        if (a[k] !== oa[k]) {
          return sa.set(Object.assign({}, oa, a))(s)
        }
      }
      return s
    }
  )

/** @internal */
export const lensComponent = <A extends ReadonlyArray<unknown>, P extends keyof A>(prop: P) => <S>(
  sa: Lens<S, A>
): Lens<S, A[P]> =>
  lens(
    (s) => sa.get(s)[prop],
    (ap) => (s) => {
      const oa = sa.get(s)
      if (ap === oa[prop]) {
        return s
      }
      const copy: A = oa.slice() as any
      copy[prop] = ap
      return sa.set(copy)(s)
    }
  )

/** @internal */
export const lensAtKey = (key: string) => <S, A>(sa: Lens<S, RR.ReadonlyRecord<string, A>>): Lens<S, O.Option<A>> =>
  pipe(sa, lensComposeLens(atReadonlyRecord<A>().at(key)))

// -------------------------------------------------------------------------------------
// Prism
// -------------------------------------------------------------------------------------

/** @internal */
export const prism = <S, A>(
  getOption: Prism<S, A>['getOption'],
  reverseGet: Prism<S, A>['reverseGet']
): Prism<S, A> => ({ getOption, reverseGet })

/** @internal */
export const prismAsOptional = <S, A>(sa: Prism<S, A>): Optional<S, A> => optional(sa.getOption, (a) => prismSet(a)(sa))

/** @internal */
export const prismAsTraversal = <S, A>(sa: Prism<S, A>): Traversal<S, A> =>
  traversal(<F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      sa.getOption(s),
      O.match(
        () => F.of(s),
        (a) =>
          pipe(
            f(a),
            F.map((a) => prismSet(a)(sa)(s))
          )
      )
    )
  )

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
export const prismFromNullable = <A>(): Prism<A, NonNullable<A>> => prism(O.fromNullable, identity)

/** @internal */
export const prismFromPredicate = <A>(predicate: Predicate<A>): Prism<A, A> =>
  prism(O.fromPredicate(predicate), identity)

/** @internal */
export const prismSome = <A>(): Prism<O.Option<A>, A> => prism(identity, O.some)

/** @internal */
export const prismRight = <E, A>(): Prism<E.Either<E, A>, A> => prism(O.fromEither, E.right)

/** @internal */
export const prismLeft = <E, A>(): Prism<E.Either<E, A>, E> =>
  prism(
    (s) => (E.isLeft(s) ? O.some(s.left) : O.none), // TODO: replace with E.getLeft in v3
    E.left
  )

// -------------------------------------------------------------------------------------
// Optional
// -------------------------------------------------------------------------------------

/** @internal */
export const optional = <S, A>(
  getOption: Optional<S, A>['getOption'],
  set: Optional<S, A>['replace']
): Optional<S, A> => ({
  getOption,
  replace: set
})

/** @internal */
export const optionalAsTraversal = <S, A>(sa: Optional<S, A>): Traversal<S, A> =>
  traversal(<F>(F: Applicative<F>) => (f: (a: A) => HKT<F, A>) => (s: S) =>
    pipe(
      sa.getOption(s),
      O.match(
        () => F.of(s),
        (a) =>
          pipe(
            f(a),
            F.map((a: A) => sa.replace(a)(s))
          )
      )
    )
  )

/** @internal */
export const optionalModifyOption = <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S): O.Option<S> =>
  pipe(
    optional.getOption(s),
    O.map((a) => {
      const n = f(a)
      return n === a ? s : optional.replace(n)(s)
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
export const optionalComposeOptional = <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>): Optional<S, B> =>
  optional(flow(sa.getOption, O.chain(ab.getOption)), (b) => optionalModify(ab.replace(b))(sa))

/** @internal */
export const optionalIndex = (i: number) => <S, A>(sa: Optional<S, ReadonlyArray<A>>): Optional<S, A> =>
  pipe(sa, optionalComposeOptional(indexReadonlyArray<A>().index(i)))

/** @internal */
export const optionalIndexNonEmpty = (i: number) => <S, A>(
  sa: Optional<S, RNEA.ReadonlyNonEmptyArray<A>>
): Optional<S, A> => pipe(sa, optionalComposeOptional(indexReadonlyNonEmptyArray<A>().index(i)))

/** @internal */
export const optionalKey = (key: string) => <S, A>(sa: Optional<S, RR.ReadonlyRecord<string, A>>): Optional<S, A> =>
  pipe(sa, optionalComposeOptional(indexReadonlyRecord<A>().index(key)))

/** @internal */
export const optionalFindFirst = <A>(predicate: Predicate<A>): Optional<ReadonlyArray<A>, A> =>
  optional(RA.findFirst(predicate), (a) => (as) =>
    RA.isNonEmpty(as)
      ? pipe(
          RA.findIndex(predicate)(as),
          O.match(
            () => as,
            (i) => unsafeUpdateAt(i, a, as)
          )
        )
      : as
  )

const unsafeUpdateAt = <A>(i: number, a: A, as: RNEA.ReadonlyNonEmptyArray<A>): RNEA.ReadonlyNonEmptyArray<A> => {
  if (as[i] === a) {
    return as
  } else {
    const xs: NonEmptyArray<A> = [as[0], ...as.slice(1)]
    xs[i] = a
    return xs
  }
}

/** @internal */
export const optionalFindFirstNonEmpty = <A>(predicate: Predicate<A>): Optional<RNEA.ReadonlyNonEmptyArray<A>, A> =>
  optional<RNEA.ReadonlyNonEmptyArray<A>, A>(RA.findFirst(predicate), (a) => (as) =>
    pipe(
      RA.findIndex(predicate)(as),
      O.match(
        () => as,
        (i) => unsafeUpdateAt(i, a, as)
      )
    )
  )

// -------------------------------------------------------------------------------------
// Traversal
// -------------------------------------------------------------------------------------

/** @internal */
export const traversal = <S, A>(modifyF: Traversal<S, A>['modifyF']): Traversal<S, A> => ({
  modifyF
})

/** @internal */
export function traversalComposeTraversal<A, B>(ab: Traversal<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B> {
  return (sa) => traversal(<F>(F: Applicative<F>) => (f: (a: B) => HKT<F, B>) => sa.modifyF(F)(ab.modifyF(F)(f)))
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

/** @internal */
export function traversalTraverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Traversal<S, Kind<T, A>>) => Traversal<S, A> {
  return traversalComposeTraversal(fromTraversable(T)())
}

// -------------------------------------------------------------------------------------
// Ix
// -------------------------------------------------------------------------------------

/** @internal */
export const index = <S, I, A>(index: Index<S, I, A>['index']): Index<S, I, A> => ({ index })

/** @internal */
export const indexReadonlyArray = <A = never>(): Index<ReadonlyArray<A>, number, A> =>
  index((i) =>
    optional(RA.lookup(i), (a) => (as) =>
      RA.isNonEmpty(as)
        ? pipe(
            RA.lookup(i)(as),
            O.match(
              () => as,
              () => unsafeUpdateAt(i, a, as)
            )
          )
        : as
    )
  )

/** @internal */
export const indexReadonlyNonEmptyArray = <A = never>(): Index<RNEA.ReadonlyNonEmptyArray<A>, number, A> =>
  index((i) =>
    optional(RA.lookup(i), (a) => (as) =>
      pipe(
        RA.lookup(i)(as),
        O.match(
          () => as,
          () => unsafeUpdateAt(i, a, as)
        )
      )
    )
  )

/** @internal */
export const indexReadonlyRecord = <A = never>(): Index<RR.ReadonlyRecord<string, A>, string, A> =>
  index((k) =>
    optional(RR.lookup(k), (a) => (r) => {
      if (r[k] === a || O.isNone(RR.lookup(k)(r))) {
        return r
      }
      return RR.upsertAt(k, a)(r)
    })
  )

// -------------------------------------------------------------------------------------
// At
// -------------------------------------------------------------------------------------

/** @internal */
export const at = <S, I, A>(at: At<S, I, A>['at']): At<S, I, A> => ({ at })

const deleteAt = (k: string) => <A>(r: Readonly<Record<string, A>>): Readonly<Record<string, A>> =>
  pipe(
    r,
    RR.deleteAt(k),
    O.getOrElse(() => r)
  )

/** @internal */
export function atReadonlyRecord<A = never>(): At<RR.ReadonlyRecord<string, A>, string, O.Option<A>> {
  return {
    at: (key) => ({
      get: RR.lookup(key),
      set: O.match(
        () => deleteAt(key),
        (a) => RR.upsertAt(key, a)
      )
    })
  }
}
