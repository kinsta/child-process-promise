'use strict'
const child_process = require('child_process')
const crossSpawn = require('cross-spawn')
const ChildProcessPromise = require('./ChildProcessPromise')
const ChildProcessError = require('./ChildProcessError')

const slice = Array.prototype.slice

function doExec(method, args) {
  let cp
  const cpPromise = new ChildProcessPromise()
  const reject = cpPromise._cpReject
  const resolve = cpPromise._cpResolve

  var finalArgs = slice.call(args, 0)
  finalArgs.push(callback)

  cp = child_process[method].apply(child_process, finalArgs)

  function callback(err, stdout, stderr) {
    if (err) {
      const commandStr =
        args[0] + (Array.isArray(args[1]) ? ' ' + args[1].join(' ') : '')
      err.message +=
        ' `' + commandStr + '` (exited with error code ' + err.code + ')'
      err.stdout = stdout
      err.stderr = stderr
      const cpError = new ChildProcessError(
        err.message,
        err.code,
        child_process,
        stdout,
        stderr
      )
      reject(cpError)
    } else {
      resolve({
        childProcess: cp,
        stdout: stdout,
        stderr: stderr,
      })
    }
  }

  cpPromise.childProcess = cp

  return cpPromise
}

function exec() {
  return doExec('exec', arguments)
}

function execFile() {
  return doExec('execFile', arguments)
}

function doSpawn(method, command, args, options) {
  const result = {}

  let cp
  const cpPromise = new ChildProcessPromise()
  const reject = cpPromise._cpReject
  const resolve = cpPromise._cpResolve

  const successfulExitCodes = (options && options.successfulExitCodes) || [0]

  cp = method(command, args, options)

  // Don't return the whole Buffered result by default.
  let captureStdout = false
  let captureStderr = false

  const capture = options && options.capture
  if (capture) {
    for (let i = 0, len = capture.length; i < len; i++) {
      const cur = capture[i]
      if (cur === 'stdout') {
        captureStdout = true
      } else if (cur === 'stderr') {
        captureStderr = true
      }
    }
  }

  result.childProcess = cp

  if (captureStdout) {
    result.stdout = ''

    cp.stdout.on('data', function (data) {
      result.stdout += data
    })
  }

  if (captureStderr) {
    result.stderr = ''

    cp.stderr.on('data', function (data) {
      result.stderr += data
    })
  }

  cp.on('error', reject)

  const closeHandler = function (code) {
    if (successfulExitCodes.indexOf(code) === -1) {
      var commandStr = command + (args.length ? ' ' + args.join(' ') : '')
      var message = '`' + commandStr + '` failed with code ' + code
      var err = new ChildProcessError(message, code, cp)

      if (captureStderr) {
        err.stderr = result.stderr.toString()
      }

      if (captureStdout) {
        err.stdout = result.stdout.toString()
      }

      reject(err)
    } else {
      result.code = code
      resolve(result)
    }
  }

  cp.on('close', closeHandler)
  cp.on('exit', closeHandler)

  cpPromise.childProcess = cp

  return cpPromise
}

function spawn(command, args, options) {
  return doSpawn(crossSpawn, command, args, options)
}

function fork(modulePath, args, options) {
  return doSpawn(child_process.fork, modulePath, args, options)
}

exports.exec = exec
exports.execFile = execFile
exports.spawn = spawn
exports.fork = fork
