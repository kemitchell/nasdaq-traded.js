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
