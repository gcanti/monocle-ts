import { Iso } from '../src'

const mTokm = new Iso<number, number>(
  m => m / 1000,
  km => km * 1000
)

console.log(mTokm.get(100)) // => 0.1
console.log(mTokm.reverseGet(1.2)) // => 1200

const kmToMile = new Iso<number, number>(
  km => km / 1.60934,
  miles => miles * 1.60934
)

// composition
const mToMile = mTokm.compose(kmToMile)

console.log(mToMile.get(100)) // => 0.06213727366498068
