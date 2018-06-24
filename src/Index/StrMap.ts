import { Index } from '../index'
import { atStrMap } from '../At/StrMap'

export function indexStrMap<A = never>() {
  return Index.fromAt(atStrMap<A>())
}
