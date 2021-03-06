/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.3.0
 */
import { Eq } from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as RM from 'fp-ts/lib/ReadonlyMap'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import * as RS from 'fp-ts/lib/ReadonlySet'
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
 * Lift an instance of `At` using an `Iso`.
 *
 * @category constructors
 * @since 2.3.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: At<S, I, A>): At<T, I, A> => ({
  at: (i) => pipe(iso, _.isoAsLens, _.lensComposeLens(sia.at(i)))
})

/**
 * @category constructors
 * @since 2.3.7
 */
export const atReadonlyRecord: <A = never>() => At<ReadonlyRecord<string, A>, string, Option<A>> = _.atReadonlyRecord

/**
 * @category constructors
 * @since 2.3.7
 */
export const atReadonlyMap = <K>(E: Eq<K>): (<A = never>() => At<ReadonlyMap<K, A>, K, Option<A>>) => {
  const lookupE = RM.lookup(E)
  const deleteAtE = RM.deleteAt(E)
  const insertAtE = RM.insertAt(E)
  return () => ({
    at: (key) => ({
      get: (s) => lookupE(key, s),
      set: O.fold(
        () => deleteAtE(key),
        (a) => insertAtE(key, a)
      )
    })
  })
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
        get: (s) => elemE(a, s),
        set: (b) => (s) => (b ? insert(s) : remove(s))
      }
    }
  }
}

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * Use `atReadonlyRecord` instead.
 *
 * @category constructors
 * @since 2.3.2
 * @deprecated
 */
export const atRecord: <A = never>() => At<ReadonlyRecord<string, A>, string, Option<A>> = _.atReadonlyRecord
