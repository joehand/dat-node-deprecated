const fs = require('fs')
const path = require('path')
const mirror = require('mirror-folder')
const ram = require('random-access-memory')
const rimraf = require('rimraf')
const Dat = require('..')

const key = process.argv[2]
if (!key) {
  console.error('Run with: node examples/download.js <key>')
  process.exit(1)
}

const dest = path.join(__dirname, 'data')
rimraf.sync(dest)

run()

async function run () {
  let datSource
  let dat
  try {
    datSource = await Dat(ram, { key: key, sparse: true })
    dat = await Dat(dest, { key })
  } catch (e) {
    throw e
  }

  const network = await datSource.joinNetwork()
  await dat.joinNetwork(network)

  datSource.archive.metadata.update(download)

  function download () {
    if (datSource.version < 1) return datSource.archive.metadata.update(download)
    var progress = mirror({ fs: datSource.archive, name: '/' }, dest, function (err) {
      if (err) throw err
      console.log('Done')
      // console.log(dat)
      network.stop()
    })
    progress.on('put', function (src) {
      console.log('Downloading', src.name)
    })
  }

  console.log(`Downloading: ${dat.key.toString('hex')}\n`)

  // setTimeout(function () {
  //   console.log('time done')
  // }, 5000)
}
