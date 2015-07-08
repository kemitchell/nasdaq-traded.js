/*
 * Copyright 2015 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
*/

var JSONStream = require('JSONStream')
var byline = require('byline')
var FTPClient = require('ftp')
var through = require('through2')
var merge = require('util-merge')

var SERVER = 'ftp.nasdaqtrader.com'
var LISTED_TXT = 'SymbolDirectory/nasdaqlisted.txt'

var STATUSES = require('./statuses')

var FIELDS = [
  { name: 'symbol' },
  { name: 'security' },
  { name: 'category',
    filter: require('./markets') },
  { name: 'test',
    filter: {
      Y: true,
      N: false } },
  { name: 'status',
    filter: (function() {
      return function(string) {
        return merge(
          { deficient: false,
            delinquent: false,
            bankrupt: false },
          STATUSES[string]) } })() },
  { name: 'lot',
    filter: function(string) {
      return parseInt(string) } } ]

function fetchNASDAQTraded(callback) {
  var results = []
  var client = new FTPClient()
    .on('ready', function() {
      client.get(LISTED_TXT, function(error, stream) {
        if (error) {
          callback(error) }
        else {
          stream

            // Read by line.
            .pipe(byline.createStream())

            // Filter out the timestamp and stringify.
            .pipe(through.obj(function(line, encoding, done) {
              line = line.toString()
              if (line.indexOf('File Creation Time') > -1) {
                done() }
              else {
                done(null, line) } }))

            // Parse fields.
            .pipe(through.obj(function(line, encoding, done) {
              var split = line.split('|')
              var object = split.reduce(function(object, element, index) {
                var instructions = FIELDS[index]
                var value
                if (instructions.hasOwnProperty('filter')) {
                  var filter = instructions.filter
                  value = typeof filter === 'function' ?
                    filter(element) : filter[element] }
                else {
                  value = element }
                object[instructions.name] = value
                return object }, {})

              // Split the security name to find issuer and type.
              var securitySplit = object.security.split(' - ')
              object.issuer = securitySplit[0]
              object.type = securitySplit[1]
              done(null, object) }))

            .on('data', function(object) {
              if (object.issuer !== 'Security Name') {
                results.push(object) } })
            
            .on('end', function() {
              client.end()
              callback(null, results) }) } }) })

  client.connect({ host: SERVER }) }

module.exports = fetchNASDAQTraded
