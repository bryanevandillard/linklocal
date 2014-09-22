#!/usr/bin/env node

var path = require('path')
var linklocal = require('../')
var program = require('commander')
var pkg = require('../package.json')

program
  .version(pkg.version)
  .option('-u, --unlink', 'Unlink local dependencies')
  // ignore --link only for api balancing with unlink
  .option('-l, --link', 'Link local dependencies [default]')
  .usage('[options] <dir>')

program.on('--help', function(){
  console.info('  Examples:')
  console.info('')
  console.info('    $ linklocal')
  console.info('    $ linklocal --unlink')
  console.info('')
  console.info('    $ linklocal mydir')
  console.info('    $ linklocal --unlink mydir')
  console.info('')
})

program.parse(process.argv)

var command = program.unlink ? 'unlink' : 'link'

program.args[0] = program.args[0] || ''

var dir = path.resolve(process.cwd(), program.args[0]) || process.cwd()
var pkg = path.resolve(dir, 'package.json')

linklocal[command](dir, pkg, function(err, items) {
  if (err) throw err
  var commandName = command[0].toUpperCase() + command.slice(1)
  console.error('%sed %d dependencies', commandName, items.length)
  items.forEach(function(item) {
    console.info('%sed %s', commandName, path.relative(process.cwd(), item))
  })
})
