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

    const info1 = Optional.fromNullableProp<Response, Info, 'info'>('info')
    const employment1 = Optional.fromNullableProp<Info, Employment, 'employment'>('employment')
    const phone1 = Optional.fromNullableProp<Employment, Phone, 'phone'>('phone')
    const number = Lens.fromProp<Phone>()('number')
    const numberFromResponse1 = info1
      .compose(employment1)
      .compose(phone1)
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

    assert.deepEqual(numberFromResponse1.getOption(response1), some('555-1234'))
    assert.deepEqual(numberFromResponse1.getOption(response2), none)

    const info2 = Optional.fromNullableProp<Response>()('info')
    const employment2 = Optional.fromNullableProp<Info>()('employment')
    const phone2 = Optional.fromNullableProp<Employment>()('phone')
    const numberFromResponse2 = info2
      .compose(employment2)
      .compose(phone2)
      .composeLens(number)

    assert.deepEqual(numberFromResponse2.getOption(response1), some('555-1234'))
    assert.deepEqual(numberFromResponse2.getOption(response2), none)
  })

  it('fromOptionProp', () => {
    interface Phone {
      number: string
    }
    interface Employment {
      phone: Option<Phone>
    }
    interface Info {
      employment: Option<Employment>
    }
    interface Response {
      info: Option<Info>
    }

    const info1 = Optional.fromOptionProp<Response>('info')
    const employment1 = Optional.fromOptionProp<Info>('employment')
    const phone1 = Optional.fromOptionProp<Employment>('phone')
    const number = Lens.fromProp<Phone>()('number')
    const numberFromResponse1 = info1
      .compose(employment1)
      .compose(phone1)
      .composeLens(number)

    const response1: Response = {
      info: some({
        employment: some({
          phone: some({
            number: '555-1234'
          })
        })
      })
    }
    const response2: Response = {
      info: some({
        employment: none
      })
    }

    assert.deepEqual(numberFromResponse1.getOption(response1), some('555-1234'))
    assert.deepEqual(numberFromResponse1.getOption(response2), none)

    const info2 = Optional.fromOptionProp<Response>()('info')
    const employment2 = Optional.fromOptionProp<Info>()('employment')
    const phone2 = Optional.fromOptionProp<Employment>()('phone')
    const numberFromResponse2 = info2
      .compose(employment2)
      .compose(phone2)
      .composeLens(number)

    assert.deepEqual(numberFromResponse2.getOption(response1), some('555-1234'))
    assert.deepEqual(numberFromResponse2.getOption(response2), none)

    // Check the laws
    const opt = numberFromResponse1
    // Law 1
    assert.deepEqual(opt.set('555-4321')(response1), {
      info: some({
        employment: some({
          phone: some({
            number: '555-4321'
          })
        })
      })
    })
    assert.deepEqual(opt.set('555-4321')(response2), response2)
    // Law 2
    assert.deepEqual(opt.getOption(opt.set('555-4321')(response1)), opt.getOption(response1).map(() => '555-4321'))
    assert.deepEqual(opt.getOption(opt.set('555-4321')(response2)), opt.getOption(response2).map(() => '555-4321'))
    // law 3
    assert.deepEqual(opt.set('555-4321')(opt.set('555-4321')(response1)), opt.set('555-4321')(response1))
    assert.deepEqual(opt.set('555-4321')(opt.set('555-4321')(response2)), opt.set('555-4321')(response2))
  })

  it('modify', () => {
    const double = (n: number): number => n * 2
    assert.deepEqual(optional.modify(double)({ a: some(2) }), { a: some(4) })
    assert.deepEqual(optional.modify(double)({ a: none }), { a: none })
  })
})
