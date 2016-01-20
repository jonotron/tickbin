export default upgrade

import chalk from 'chalk'
import db from '../db'
import createEntryIndex from '../db/designEntryIndex'
import Entry from '../entry'
import _ from 'lodash'
import moment from 'moment'

function upgrade (yargs) {
  let argv = yargs
  .usage('Usage: tick upgrade')
  .help('h')
  .alias('h', 'help')
  .argv

  createEntryIndex(db)
  .then( () => console.log('index ensured'))
  .then(reparse)
}

function reparse () {
  return db.query('entry_index/by_version', {
    startkey: 0,
    endkey: 1,
    include_docs: true 
  })
  .then(res => {
    let newDocs = _.chain(res.rows)
      .pluck('doc')
      .map(map0to1)
      .map(map1to2)
      .value()
    return db.bulkDocs(newDocs)
  })
  .then(res => {
    console.log(`updated ${res.length} documents`) 
  })
}

function map0to1 (doc) {
  if (doc.version >= 1)
    return doc

  const date = moment(doc.from).toDate()
  const e = new Entry(doc.message, { date })
  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.version = e.version

  return newDoc 
}

function map1to2 (doc) {
  if (doc.version >= 2)
    return doc

  const date = moment(doc.from).toDate()
  const e = new Entry(doc.message, { date })
  let newDoc = {}
  Object.assign(newDoc, doc)

  newDoc.time = e.time

  return newDoc
}