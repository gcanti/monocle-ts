import { At, Lens } from '../index'
import { Option } from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'

export function atRecord<A = never>(): At<Record<string, A>, string, Option<A>> {
  // tslint:disable-next-line: deprecation
  return new At(at => new Lens(s => R.lookup(at, s), a => s => a.fold(R.remove(at, s), x => R.insert(at, x, s))))
}
