const readline = require('readline')

const ask = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve, reject) => {
    rl.question(text, resolve)
  })
    .finally(() => {
      rl.close()
    })
}

const getValue = (param) => {
  return param.mode ? param.pos : param.value
}

const intcodeCompute = async (buffer, noun, verb) => {
  let offset = 4
  let pointer = 0

  if (typeof noun !== 'undefined' && typeof verb !== 'undefined') {
    //console.log('setup noun and verb')
    buffer[1] = noun
    buffer[2] = verb
  }

  while (pointer < buffer.length && buffer[pointer] !== 99) {
    let input
    const instruction = String(buffer[pointer]).padStart(5, '0')
    const opCode = parseInt(instruction.slice(-2), 10)
    // console.log('instruction', instruction, 'opCode', opCode)
    if (isNaN(opCode)) {
      console.log('nan opcode', buffer[pointer])
    }

    const firstParam = { pos: buffer[pointer + 1], value: buffer[buffer[pointer + 1]], mode: parseInt(instruction[2], 10) }
    const secondParam = { pos: buffer[pointer + 2], value: buffer[buffer[pointer + 2]], mode: parseInt(instruction[1], 10) }
    const thirdParam = { pos: buffer[pointer + 3], value: buffer[buffer[pointer + 3]], mode: parseInt(instruction[0], 10) }
    // console.log(firstParam, secondParam, thirdParam)

    switch (opCode) {
      case 1:
        buffer[thirdParam.pos] = getValue(firstParam) + getValue(secondParam)
        offset = 4
        break
      case 2:
        buffer[thirdParam.pos] = getValue(firstParam) * getValue(secondParam)
        offset = 4
        break
      case 3:
        offset = 2
        input = await ask('input\n')
        // console.log('input', input)
        buffer[firstParam.pos] = parseInt(input)
        break
      case 4:
        offset = 2
        console.log('output', buffer[firstParam.pos], buffer.length, firstParam)
        break
      case 5:
        offset = 3
        if (getValue(firstParam) !== 0) {
          pointer = getValue(secondParam)
          continue
        }
        break
      case 6:
        offset = 3
        if (getValue(firstParam) === 0) {
          pointer = getValue(secondParam)
          continue
        }
        break
      case 7:
        offset = 4
        buffer[thirdParam.pos] = getValue(firstParam) < getValue(secondParam) ? 1 : 0
        break
      case 8:
        offset = 4
        buffer[thirdParam.pos] = getValue(firstParam) === getValue(secondParam) ? 1 : 0
        break
      default:
        //console.log('unknow opcode', opCode)
        break
    }
    pointer += offset
  }
  // console.log(buffer)
  return { noun, verb, result: buffer[0], buffer }
}

module.exports = intcodeCompute
