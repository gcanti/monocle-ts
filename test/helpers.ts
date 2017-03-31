import * as assert from 'assert'
import { Option, isSome, isNone } from 'fp-ts/lib/Option'

export function eqOptions<A>(x: Option<A>, y: Option<A>) {
  if (isSome(x) && isSome(y)) {
    assert.deepEqual(x.value, y.value)
  } else {
    assert.strictEqual(isNone(x), isNone(y))
  }
}
