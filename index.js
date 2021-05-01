const fs = require('fs')
const readline = require('readline')
const moment = require('moment-timezone')

var logger = fs.createWriteStream('output.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

async function processLineByLine () {
  const fileStream = fs.createReadStream('input.txt')

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    const offset = moment.tz.zone(line).utcOffset(moment())

    let offsetH = (offset / 60).toFixed(0)
    let offsetM = Math.abs(offset - offsetH * 60)

    if (Math.abs(offsetM).toString().length == 1) offsetM = '0' + offsetM

    if (offsetH >= 0) offsetH = '+' + offsetH
    const output = `"[GMT ${offsetH}:${offsetM}] ${line}",`
    console.log(output)
    logger.write(output+"\n")
  }
}

processLineByLine()
