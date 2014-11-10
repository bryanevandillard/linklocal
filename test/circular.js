"use strict"

var test = require('tape')

var fs = require("fs")
var path = require('path')
var exec = require('child_process').exec
var rimraf = require('rimraf')

var linklocalBin = path.resolve(__dirname, '..', require('../package.json').bin['linklocal'])

var linklocal = require("../")

var PKG_A = path.resolve(__dirname, 'circular-a')
var PKG_B = path.resolve(__dirname, 'circular-b')
var PKG_C = path.resolve(__dirname, 'circular-c')

var A_TO_B = path.join(PKG_A, 'node_modules', 'circular-b')
var B_TO_C = path.join(PKG_B, 'node_modules', 'circular-c')
var C_TO_A = path.join(PKG_C, 'node_modules', 'circular-a')
var A_TO_B_TO_C = path.join(A_TO_B, 'node_modules', 'circular-c')
var A_TO_B_TO_C_TO_A = path.join(A_TO_B_TO_C, 'node_modules', 'circular-a')

var LINKS = Object.freeze([
  A_TO_B,
  B_TO_C,
  C_TO_A
].sort())

function setup() {
  rimraf.sync(path.resolve(PKG_A, 'node_modules'))
  rimraf.sync(path.resolve(PKG_B, 'node_modules'))
  rimraf.sync(path.resolve(PKG_C, 'node_modules'))
}

test('circular dependencies recursive no parent', function(t) {
  setup()
  linklocal.link.recursive(PKG_A, function(err, linked) {
    t.ifError(err)
    var expected = LINKS.slice()
    t.deepEqual(linked, expected)
    t.end()
  })
})