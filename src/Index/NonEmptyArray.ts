import { Index, Optional } from '../index'
import { NonEmptyArray, updateAt } from 'fp-ts/lib/NonEmptyArray'
import { lookup } from 'fp-ts/lib/Array'
import { isNone } from 'fp-ts/lib/Option'

/**
 * @since 1.2.0
 */
export function indexNonEmptyArray<A = never>(): Index<NonEmptyArray<A>, number, A> {
  return new Index(
    i =>
      new Optional(
        s => lookup(i, s),
        a => nea => {
          const onea = updateAt(i, a)(nea)
          if (isNone(onea)) {
            return nea
          } else {
            return onea.value
          }
        }
      )
  )
}
