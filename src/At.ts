/**
 * @since 2.3.0
 */
import { Eq } from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as RM from 'fp-ts/ReadonlyMap'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'

import Option = O.Option

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.3.0
 */
export interface At<S, I, A> {
  readonly at: (i: I) => Lens<S, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.8
 */
export const at: <S, I, A>(at: At<S, I, A>['at']) => At<S, I, A> = _.at

/**
 * Lift an instance of `At` using an `Iso`.
 *
 * @category constructors
 * @since 2.3.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: At<S, I, A>): At<T, I, A> =>
  at((i) => pipe(iso, _.isoAsLens, _.lensComposeLens(sia.at(i))))

/**
 * @category constructors
 * @since 2.3.7
 */
export const atReadonlyRecord: <A = never>() => At<ReadonlyRecord<string, A>, string, Option<A>> = _.atReadonlyRecord

/**
 * @category constructors
 * @since 2.3.7
 */
export const atReadonlyMap = <K>(E: Eq<K>): (<A = never>() => At<ReadonlyMap<K, A>, K, Option<A>>) => () => {
  const lookupE = RM.lookup(E)
  const deleteAtE = RM.deleteAt(E)
  const upsertAtE = RM.upsertAt(E)
  return {
    at: (key) => ({
      get: lookupE(key),
      set: O.match(
        () => (m) =>
          pipe(
            m,
            deleteAtE(key),
            O.getOrElse(() => m)
          ),
        (a) => upsertAtE(key, a)
      )
    })
  }
}

/**
 * @category constructors
 * @since 2.3.7
 */
export const atReadonlySet = <A>(E: Eq<A>): At<ReadonlySet<A>, A, boolean> => {
  const elemE = RS.elem(E)
  const insertE = RS.insert(E)
  const removeE = RS.remove(E)
  return {
    at: (a) => {
      const insert = insertE(a)
      const remove = removeE(a)
      return {
        get: elemE(a),
        set: (b) => (s) => (b ? insert(s) : remove(s))
      }
    }
  }
}
