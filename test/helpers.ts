import * as assert from 'assert'
import { HKTOption, isSome, isNone } from 'fp-ts/lib/Option'

export function eqOptions<A>(x: HKTOption<A>, y: HKTOption<A>) {
  if (isSome(x) && isSome(y)) {
    assert.deepEqual(x.value, y.value)
  } else {
    assert.strictEqual(isNone(x), isNone(y))
  }
}
