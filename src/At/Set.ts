import { At, Lens } from '../index'
import { Setoid } from 'fp-ts/lib/Setoid'
import * as S from 'fp-ts/lib/Set'

export function atSet<A = never>(setoid: Setoid<A>): At<Set<A>, A, boolean> {
  const member = S.member(setoid)
  const insert = S.insert(setoid)
  const remove = S.remove(setoid)
  return new At(at => new Lens(s => member(s)(at), a => s => (a ? insert(at, s) : remove(at, s))))
}
