import moment from 'moment'
import chalk from 'chalk'
import format from '../time'
import pad from 'pad'

export {write as write}
export {getOutputs as getOutputs}

function write(entry) {
  const {detailed} = getOutputs(entry)

  console.log(detailed)
}

function getOutputs(entry) {
  const id = `${chalk.gray(pad(entry._id, 10))}`
  const date = `${chalk.yellow(pad(moment(entry.from).format('ddd MMM DD'),9))}` 
  const time = chalk.green(format(entry.duration.minutes))
  const msg = `${entry.message}` 
  const detailed = `${id} ${date} ${time} ${msg}`
  const simple = `${id} ${time} ${msg}`

  return {id, date, time, msg, detailed, simple}
}