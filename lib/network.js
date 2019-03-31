var assert = require('assert')
var Hyperdiscovery = require('hyperdiscovery')

module.exports = async function (archive, network, opts, cb) {
  assert.ok(archive, 'dat-node: lib/network archive required')
  assert.ok(opts, 'dat-node: lib/network opts required')
  var DEFAULT_PORT = 3282

  if (network) {
    return await network.add(archive)
  }

  var hyperdiscovery = Hyperdiscovery(opts)
  await hyperdiscovery.add(archive)

  // var swarmOpts = Object.assign({
  //   hash: false,
  //   stream: opts.stream
  // }, opts)

  // var swarm = disc(swarmDefaults(swarmOpts))
  // swarm.once('error', function () {
  //   swarm.listen(0)
  // })
  // swarm.listen(opts.port || DEFAULT_PORT)
  // swarm.join(archive.discoveryKey, { announce: !(opts.upload === false) }, cb)
  // swarm.options = swarm._options
  return hyperdiscovery
}
