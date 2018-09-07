import * as assert from 'assert'
import { Optional, Lens } from '../src'
import { none, some, Option } from 'fp-ts/lib/Option'

interface A {
  a: Option<number>
}

const optional = new Optional<A, number>(s => s.a, a => s => s.a.fold<A>(s, () => ({ ...s, a: some(a) })))

describe('Optional', () => {
  it('getOption', () => {
    assert.deepEqual(optional.getOption({ a: none }), none)
    assert.deepEqual(optional.getOption({ a: some(1) }), some(1))
  })

  it('set', () => {
    assert.deepEqual(optional.set(2)({ a: some(1) }).a, some(2))
  })

  it('fromNullableProp', () => {
    interface Phone {
      number: string
    }
    interface Employment {
      phone?: Phone
    }
    interface Info {
      employment?: Employment
    }
    interface Response {
      info?: Info
    }

    const info = Optional.fromNullableProp<Response, Info, 'info'>('info')
    const employment = Optional.fromNullableProp<Info, Employment, 'employment'>('employment')
    const phone = Optional.fromNullableProp<Employment, Phone, 'phone'>('phone')
    const number = Lens.fromProp<Phone, 'number'>('number')
    const numberFromResponse = info
      .compose(employment)
      .compose(phone)
      .composeLens(number)

    const response1: Response = {
      info: {
        employment: {
          phone: {
            number: '555-1234'
          }
        }
      }
    }
    const response2: Response = {
      info: {
        employment: {}
      }
    }

    assert.deepEqual(numberFromResponse.getOption(response1), some('555-1234'))
    assert.deepEqual(numberFromResponse.getOption(response2), none)
  })

  it('modify', () => {
    const double = (n: number): number => n * 2
    assert.deepEqual(optional.modify(double)({ a: some(2) }), { a: some(4) })
    assert.deepEqual(optional.modify(double)({ a: none }), { a: none })
  })
})
