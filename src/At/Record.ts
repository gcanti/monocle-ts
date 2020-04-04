/**
 * @since 1.7.0
 */
import { At, Lens } from '../index'
import { Option, isNone } from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'

/**
 * @since 1.7.0
 */
export function atRecord<A = never>(): At<Record<string, A>, string, Option<A>> {
  return new At(
    (k) =>
      new Lens(
        (r) => R.lookup(k, r),
        (oa) => (r) => {
          if (isNone(oa)) {
            return R.deleteAt(k)(r)
          } else {
            return R.insertAt(k, oa.value)(r)
          }
        }
      )
  )
}
