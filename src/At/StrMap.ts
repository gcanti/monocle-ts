import { At, Lens } from '../index'
import { Option } from 'fp-ts/lib/Option'
import * as SM from 'fp-ts/lib/StrMap'

export function atStrMap<A = never>(): At<SM.StrMap<A>, string, Option<A>> {
  return new At(at => new Lens(s => SM.lookup(at, s), a => s => a.fold(SM.remove(at, s), x => SM.insert(at, x, s))))
}
