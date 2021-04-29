child-process-promise
=====================

Simple wrapper around the `child_process` module that makes use of promises

---
**Historical Kinsta overview**

We originally used [this package][original-package] to use promises with `child_process`.
There was a deficiency in this package, it did not properly handle the close event,
so [@lpgera][lpgera-gh] [opened a PR][lpgera-pr] to fix this issue. Because we did not get any response,
we decided to fork this repository.

Basically we left this code in its original state, only changed the infrastructure around it.

---

# Installation
```
npm install @kinsta/child-process-promise --save
```

# Usage

## exec
```javascript
var exec = require('child-process-promise').exec

exec('echo hello')
  .then(({ stdout, stderr }) => {
    console.log('stdout: ', stdout)
    console.log('stderr: ', stderr)
  })
  .catch((err) => {
    console.error('ERROR: ', err)
  })
```

## spawn
```javascript
const spawn = require('child-process-promise').spawn
const promise = spawn('echo', ['hello'])
const childProcess = promise.childProcess

console.log('[spawn] childProcess.pid: ', childProcess.pid)
childProcess.stdout.on('data', (data) => {
  console.log('[spawn] stdout: ', data.toString())
})
childProcess.stderr.on('data', (data) => {
  console.log('[spawn] stderr: ', data.toString())
})

promise.then(() => {
  console.log('[spawn] done!')
})
.catch((err) => {
  console.error('[spawn] ERROR: ', err)
})
```
### Options

#### capture
Type: `Array`  
Default: `[]`

Pass an additional `capture` option to buffer the result of `stdout` and/or `stderr`

```javascript
const spawn = require('child-process-promise').spawn

spawn('echo', ['hello'], { capture: [ 'stdout', 'stderr' ]})
  .then((result) => {
    console.log('[spawn] stdout: ', result.stdout.toString())
  })
  .catch((err) => {
    console.error('[spawn] stderr: ', err.stderr)
  })
```

[original-package]: https://www.npmjs.com/package/child-process-promise
[lpgera-pr]: https://github.com/patrick-steele-idem/child-process-promise/pull/44
[lpgera-gh]: https://github.com/lpgera
