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

require('tape').test(
  'sanity checks',
  function(test) {
    require('./')(function(error, data) {
      test.error(error, 'no error')
      test.ok(
        data.length > 100,
        'at least 100 listings')
      test.ok(
        data.every(function(listing) {
          return listing.hasOwnProperty('issuer') }),
        'every listing has "issuer"')
      test.ok(
        data.every(function(listing) {
          return listing.hasOwnProperty('type') }),
        'every listing has "type"')
      test.end() }) })
