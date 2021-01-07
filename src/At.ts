/**
 * @since 3.0.0
 */
import { pipe } from 'fp-ts/function'
import { Option } from 'fp-ts/Option'
import * as _ from './internal'
import { Iso } from './Iso'
import { Lens } from './Lens'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
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
 * @since 3.0.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: At<S, I, A>): At<T, I, A> => ({
  at: (i) => pipe(iso, _.isoAsLens, _.lensComposeLens(sia.at(i)))
})

/**
 * @category constructors
 * @since 3.0.0
 */
export const atReadonlyRecord: <A = never>() => At<Readonly<Record<string, A>>, string, Option<A>> = _.atReadonlyRecord
