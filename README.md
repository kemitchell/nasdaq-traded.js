```shellsession
$ npm install --save nasdaq-listed
```

```javascript
require('nasdaq-listed')(function(error, listed) {
  if (error) {
    throw error }
  else {
	listed.forEach(function(security) {
	  console.log(security.issuer) }) } })
```
