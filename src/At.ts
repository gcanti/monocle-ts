/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 2.3.0
 */
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'

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
 * Lift an instance of `At` using an `Iso`
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
export const atReadonlyRecord: <A = never>() => At<Readonly<Record<string, A>>, string, Option<A>> = _.atReadonlyRecord

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
export const atRecord: <A = never>() => At<Readonly<Record<string, A>>, string, Option<A>> = _.atReadonlyRecord
