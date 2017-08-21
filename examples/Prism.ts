import { Prism } from '../src'
import { Option, some, none } from 'fp-ts/lib/Option'

class JStr {
  constructor(public readonly value: string) {}
}
class JNum {
  constructor(public readonly value: number) {}
}
class JObj {
  constructor(public readonly value: { [key: string]: Json }) {}
}

type Json = null | JStr | JNum | JObj

const jStr = new Prism<Json, string>(s => (s instanceof JStr ? some(s.value) : none), a => new JStr(a))

console.log(jStr.getOption(new JStr('hello')))
console.log(jStr.getOption(new JNum(1)))

// a function is applied only if there is a match
const reverse = (s: string): string => s.split('').reverse().join('')
console.log(jStr.modify(reverse)(new JStr('hello')))
console.log(jStr.modify(reverse)(new JNum(1)))
console.log(jStr.modifyOption(reverse)(new JStr('hello')))
console.log(jStr.modifyOption(reverse)(new JNum(1)))

// composizione
const jNum = new Prism<Json, number>(s => (s instanceof JNum ? some(s.value) : none), a => new JNum(a))
const numberToInt = new Prism<number, number>(s => (s % 1 === 0 ? some(s) : none), a => a)

const jInt = jNum.compose(numberToInt)

console.log(jInt.getOption(new JNum(5.0)))
console.log(jInt.getOption(new JNum(5.2)))
