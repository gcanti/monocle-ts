/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.3.0
 */
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { At } from './At'
import * as _ from './internal'
import { Iso } from './Iso'
import { Optional } from './Optional'
import * as RM from 'fp-ts/ReadonlyMap'
import { Eq } from 'fp-ts/Eq'

import Option = O.Option
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 2.3.0
 */
export interface Index<S, I, A> {
  readonly index: (i: I) => Optional<S, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 2.3.8
 */
export const index: <S, I, A>(index: Index<S, I, A>['index']) => Index<S, I, A> = _.index

/**
 * @category constructors
 * @since 2.3.0
 */
export const fromAt = <T, J, B>(at: At<T, J, Option<B>>): Index<T, J, B> =>
  index((i) => _.lensComposePrism(_.prismSome<B>())(at.at(i)))

/**
 * Lift an instance of `Index` using an `Iso`.
 *
 * @category constructors
 * @since 2.3.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: Index<S, I, A>): Index<T, I, A> =>
  index((i) => pipe(iso, _.isoAsOptional, _.optionalComposeOptional(sia.index(i))))

/**
 * @category constructors
 * @since 2.3.7
 */
export const indexReadonlyArray: <A = never>() => Index<ReadonlyArray<A>, number, A> = _.indexReadonlyArray

/**
 * @category constructors
 * @since 2.3.8
 */
export const indexReadonlyNonEmptyArray: <A = never>() => Index<ReadonlyNonEmptyArray<A>, number, A> =
  _.indexReadonlyNonEmptyArray

/**
 * @category constructors
 * @since 2.3.7
 */
export const indexReadonlyRecord: <A = never>() => Index<ReadonlyRecord<string, A>, string, A> = _.indexReadonlyRecord

/**
 * @category constructors
 * @since 2.3.7
 */
export const indexReadonlyMap = <K>(E: Eq<K>): (<A = never>() => Index<ReadonlyMap<K, A>, K, A>) => {
  const lookupE = RM.lookup(E)
  const upsertAtE = RM.upsertAt(E)
  return () =>
    index((key) =>
      _.optional(lookupE(key), (next) => {
        const upsert = upsertAtE(key, next)
        return (s) =>
          pipe(
            lookupE(key)(s),
            O.match(
              () => s,
              (prev) => (next === prev ? s : upsert(s))
            )
          )
      })
    )
}

// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------

/**
 * Use `indexReadonlyArray` instead.
 *
 * @category constructors
 * @since 2.3.2
 * @deprecated
 */
export const indexArray: <A = never>() => Index<ReadonlyArray<A>, number, A> = _.indexReadonlyArray

/**
 * Use `indexReadonlyRecord` instead.
 *
 * @category constructors
 * @since 2.3.2
 * @deprecated
 */
export const indexRecord: <A = never>() => Index<ReadonlyRecord<string, A>, string, A> = _.indexReadonlyRecord
