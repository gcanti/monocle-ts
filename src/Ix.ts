/**
 * **This module is experimental**
 *
 * Experimental features are published in order to get early feedback from the community.
 *
 * A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.
 *
 * @since 3.0.0
 */
import { Option } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { At } from './At'
import * as _ from './internal'
import { Iso } from './Iso'
import { Optional } from './Optional'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 3.0.0
 */
export interface Ix<S, I, A> {
  readonly ix: (i: I) => Optional<S, A>
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 3.0.0
 */
export const fromAt = <T, J, B>(at: At<T, J, Option<B>>): Ix<T, J, B> => ({
  ix: (i) => _.lensComposePrism(_.prismSome<B>())(at.at(i))
})

/**
 * Lift an instance of `Index` using an `Iso`
 *
 * @category constructors
 * @since 3.0.0
 */
export const fromIso = <T, S>(iso: Iso<T, S>) => <I, A>(sia: Ix<S, I, A>): Ix<T, I, A> => ({
  ix: (i) => pipe(iso, _.isoAsOptional, _.optionalComposeOptional(sia.ix(i)))
})

/**
 * @category constructors
 * @since 3.0.0
 */
export const ixReadonlyArray: <A = never>() => Ix<ReadonlyArray<A>, number, A> = _.ixReadonlyArray

/**
 * @category constructors
 * @since 3.0.0
 */
export const ixReadonlyRecord: <A = never>() => Ix<Readonly<Record<string, A>>, string, A> = _.ixReadonlyRecord
