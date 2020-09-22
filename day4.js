const data = '145852-616942'.split('-')

const start = data[0]

const end = data[1]

const checkRules = (int, noTriple = false) => {
  const arr = String(int).split('').map(y => parseInt(y, 10))
  let double = false
  let previous = null
  let counter = 0

  for (let i = 0; i < arr.length; i++) {
    if (previous) {
      if (arr[i] === previous) {
        counter += 1
        if (noTriple) {
          if (counter === 2 && arr[i] !== arr[i + 1]) {
            double = true
          }
        } else {
          double = true
        }
      } else {
        counter = 1
      }
    } else {
      counter = 1
    }
    if (arr[i] > arr[i + 1]) {
      return false
    }
    previous = arr[i]
  }
  return double
}

const matchsPart1 = []
const matchsPart2 = []

for (let x = start; x <= end; x++) {
  if (checkRules(x)) {
    matchsPart1.push(x)
  }
  if (checkRules(x, true)) {
    matchsPart2.push(x)
  }
}

console.log('first answer', matchsPart1.length)
console.log('second answer', matchsPart2.length)
