import { At, Lens } from '../index'
import { Eq } from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/Set'

export function atSet<A = never>(E: Eq<A>): At<Set<A>, A, boolean> {
  const elemE = S.elem(E)
  const insertE = S.insert(E)
  const removeE = S.remove(E)
  return new At(at => {
    const insertEAt = insertE(at)
    const removeEAt = removeE(at)
    return new Lens(s => elemE(at, s), a => s => (a ? insertEAt(s) : removeEAt(s)))
  })
}
