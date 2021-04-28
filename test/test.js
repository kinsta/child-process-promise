/* eslint-disable jest/no-conditional-expect */

'use strict'

const { ChildProcess } = require('child_process')
const path = require('path')

const childProcessPromise = require('../')
const ChildProcessPromise = require('../lib/ChildProcessPromise')
const ChildProcessError = require('../lib/ChildProcessError')

const NODE_VERSION = process.version
const NODE_PATH = process.argv[0]

describe('child-process-promise', function () {
  describe('exec', function () {
    it('should return a promise', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.exec('cat ' + fooPath)
        expect(promise.then).toBeInstanceOf(Function)
        expect(promise).toBeInstanceOf(ChildProcessPromise)
        expect(promise).toBeInstanceOf(Promise)
        done()
      })
    })

    it('should expose the `childProcess` object on the returned promise', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.exec('cat ' + fooPath)
        expect(promise.childProcess.pid).not.toBeNaN()
        done()
      })
    })

    it('should resolve with process info', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.exec('cat ' + fooPath)
        const childProcess = promise.childProcess

        promise
          .then(function (result) {
            expect(result.stdout).toBe('foo')
            expect(result.stderr).toBe('')
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
            done()
          })
          .catch(done)
      })
    })

    it('should handle rejection correctly with catch', function () {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.exec('cat ' + missingFilePath)

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .catch(function (e) {
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should handle rejection correctly with fail', function () {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.exec('cat ' + missingFilePath)

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .fail(function (e) {
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should be compatible with previous version of child-process-promise', function () {
      return new Promise(done => {
        let childProcessPid

        childProcessPromise
          .exec('echo hello')
          .then(function (result) {
            const stdout = result.stdout
            const stderr = result.stderr

            expect(stdout.toString()).toStrictEqual('hello\n')
            expect(stderr.toString()).toStrictEqual('')
            expect(childProcessPid).not.toBeNaN()
            done()
          })
          .fail(function (err) {
            console.error('ERROR: ', err.stack || err)
          })
          .progress(function (childProcess) {
            childProcessPid = childProcess.pid
          })
          .done()
      })
    })
  })

  describe('execFile', function () {
    it('should return a promise', function () {
      return new Promise(done => {
        const promise = childProcessPromise.execFile(NODE_PATH, ['--version'])
        expect(promise.then).toBeInstanceOf(Function)
        expect(promise).toBeInstanceOf(ChildProcessPromise)
        expect(promise).toBeInstanceOf(Promise)
        done()
      })
    })

    it('should expose the `childProcess` object on the returned promise', function () {
      return new Promise(done => {
        const promise = childProcessPromise.execFile(NODE_PATH, ['--version'])
        expect(promise.childProcess.pid).not.toBeNaN()
        done()
      })
    })

    it('should resolve with process info', function () {
      return new Promise(done => {
        const promise = childProcessPromise.execFile(NODE_PATH, ['--version'])
        const childProcess = promise.childProcess

        promise
          .then(function (result) {
            expect(result.stdout).toContain(NODE_VERSION)
            expect(result.stderr).toBe('')
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
            done()
          })
          .catch(done)
      })
    })

    it('should handle rejection correctly with catch', function () {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.execFile(missingFilePath, ['foo'])

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .catch(function (e) {
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should handle rejection correctly with fail', function () {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.execFile(missingFilePath, ['foo'])

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .fail(function (e) {
            expect(e).toBeInstanceOf(ChildProcessError)
            expect(e.toString()).toContain(missingFilePath)
            expect(e.code).toBe('ENOENT')
            done()
          })
          .catch(done)
      })
    })

    it('should be compatible with previous version of child-process-promise', function () {
      return new Promise(done => {
        let childProcessPid

        childProcessPromise
          .execFile(NODE_PATH, ['--version'])
          .then(function (result) {
            const stdout = result.stdout
            const stderr = result.stderr

            expect(stdout).toContain(NODE_VERSION)
            expect(stderr.toString()).toStrictEqual('')
            expect(childProcessPid).not.toBeNaN()
            done()
          })
          .progress(function (childProcess) {
            childProcessPid = childProcess.pid
          })
          .done()
      })
    })
  })

  describe('spawn', function () {
    it('should return a promise', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.spawn('cat', [fooPath])
        expect(promise.then).toBeInstanceOf(Function)
        expect(promise).toBeInstanceOf(ChildProcessPromise)
        expect(promise).toBeInstanceOf(Promise)
        done()
      })
    })

    it('should expose the `childProcess` object on the returned promise', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.spawn('cat', [fooPath])
        expect(promise.childProcess.pid).not.toBeNaN()
        done()
      })
    })

    it('should resolve with process info', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.spawn('cat', [fooPath])
        const childProcess = promise.childProcess

        childProcess.on('close', function (code) {
          expect(code).toBe(0)
          done()
        })

        promise
          .then(function (result) {
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
          })
          .catch(done)
      })
    })

    it('should support the "capture" (stdout only) option for spawn', function () {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.spawn('cat', [fooPath], {
          capture: ['stdout'],
        })
        const childProcess = promise.childProcess

        promise
          .then(function (result) {
            expect(result.stdout).toBe('foo')
            expect(result.stderr).toBeUndefined()
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
            done()
          })
          .catch(done)
      })
    })

    it('should support the "capture" (stdout and stderr) option for spawn', () => {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.spawn('cat', [fooPath], {
          capture: ['stdout', 'stderr'],
        })
        const childProcess = promise.childProcess

        promise
          .then(function (result) {
            expect(result.stdout).toBe('foo')
            expect(result.stderr).toBe('')
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
            done()
          })
          .catch(done)
      })
    })

    it('should support the "capture" (stdout and stderr) option for spawn with rejection', () => {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.spawn('cat', [missingFilePath], {
          capture: ['stdout', 'stderr'],
        })
        const childProcess = promise.childProcess

        promise
          .then(function () {
            done(new Error('rejection expected!'))
          })
          .catch(function (error) {
            expect(error).toBeInstanceOf(ChildProcessError)
            expect(error.stdout).toBe('')
            expect(error.stderr).toContain(missingFilePath)
            expect(error.childProcess).toBeInstanceOf(ChildProcess)
            expect(error.childProcess).toBe(childProcess)
            done()
          })
          .done()
      })
    })

    it('should handle rejection correctly with catch', () => {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.spawn('cat', [missingFilePath])

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .catch(function (e) {
            expect(e).toBeInstanceOf(ChildProcessError)
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should handle rejection correctly with fail', () => {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.spawn('cat', [missingFilePath])

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .fail(function (e) {
            expect(e).toBeInstanceOf(ChildProcessError)
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should be compatible with previous version of child-process-promise', () => {
      return new Promise(done => {
        let spawnOut = ''
        let spawnErr = ''
        childProcessPromise
          .spawn('echo', ['hello'])
          .progress(function (childProcess) {
            childProcess.stdout.on('data', function (data) {
              spawnOut += data
            })
            childProcess.stderr.on('data', function (data) {
              spawnErr += data
            })
          })
          .then(function () {
            expect(spawnOut.toString()).toStrictEqual('hello\n')
            expect(spawnErr.toString()).toStrictEqual('')
            done()
          })
          .done()
      })
    })

    it('should not reject when writing to stderr', () => {
      return new Promise(done => {
        const scriptPath = path.join(__dirname, 'fixtures/stderr.js')
        const promise = childProcessPromise.spawn('node', [scriptPath])

        expect(() =>
          promise
            .then(function () {
              done()
            })
            .catch(done)
        ).not.toThrow()
      })
    })

    it('should provide the exit code for success', () => {
      return new Promise(done => {
        const fooPath = path.join(__dirname, 'fixtures/foo.txt')
        const promise = childProcessPromise.spawn('cat', [fooPath])
        promise
          .then(function (result) {
            expect(result.code).toBe(0)
          })
          .catch(done)
        done()
      })
    })
  })

  describe('fork', () => {
    it('should return a promise', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'])
        expect(promise.then).toBeInstanceOf(Function)
        expect(promise).toBeInstanceOf(ChildProcessPromise)
        expect(promise).toBeInstanceOf(Promise)
        done()
      })
    })

    it('should expose the `childProcess` object on the returned promise', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'])
        expect(promise.childProcess.pid).not.toBeNaN()
        done()
      })
    })

    it('should resolve with process info', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'])
        const childProcess = promise.childProcess

        childProcess.on('close', function (code) {
          expect(code).toBe(0)
          done()
        })

        promise
          .then(function (result) {
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
          })
          .catch(done)
      })
    })

    it('should support the "capture" (stdout only) option for spawn', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'], {
          silent: true,
          capture: ['stdout'],
        })

        const childProcess = promise.childProcess

        promise
          .then(function (result) {
            expect(result.stdout).toBe('foo')
            expect(result.stderr).toBeUndefined()
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
            done()
          })
          .catch(done)
      })
    })

    it('should support the "capture" (stdout and stderr) option for spawn', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'], {
          silent: true,
          capture: ['stdout', 'stderr'],
        })

        const childProcess = promise.childProcess

        promise
          .then(function (result) {
            expect(result.stdout).toBe('foo')
            expect(result.stderr).toBe('')
            expect(result.childProcess).toBeInstanceOf(ChildProcess)
            expect(result.childProcess).toBe(childProcess)
            done()
          })
          .catch(done)
      })
    })

    it('should support the "capture" (stdout and stderr) option for spawn with rejection', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['ERROR'], {
          silent: true,
          capture: ['stdout', 'stderr'],
        })

        const childProcess = promise.childProcess

        promise
          .then(function () {
            done(new Error('rejection expected!'))
          })
          .catch(function (error) {
            expect(error).toBeInstanceOf(ChildProcessError)
            expect(error.stdout).toBe('')
            expect(error.stderr).toBe('ERROR')
            expect(error.childProcess).toBeInstanceOf(ChildProcess)
            expect(error.childProcess).toBe(childProcess)
            done()
          })
          .done()
      })
    })

    it('should handle rejection correctly with catch', () => {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.fork(missingFilePath, [], {
          silent: true,
        })

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .catch(function (e) {
            expect(e).toBeInstanceOf(ChildProcessError)
            expect(e.code).toBe(1)
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should handle rejection correctly with fail', () => {
      return new Promise(done => {
        const missingFilePath = path.join(__dirname, 'THIS_FILE_DOES_NOT_EXIST')
        const promise = childProcessPromise.fork(missingFilePath, [], {
          silent: true,
        })

        promise
          .then(function () {
            done(
              new Error('rejection was expected but it completed successfully!')
            )
          })
          .fail(function (e) {
            expect(e).toBeInstanceOf(ChildProcessError)
            expect(e.toString()).toContain(missingFilePath)
            done()
          })
          .catch(done)
      })
    })

    it('should receive message from child', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'])

        let forkSuccessfulReceived = false

        promise.childProcess.on('message', function (message) {
          if (message && message.type === 'forkSuccessful') {
            forkSuccessfulReceived = true
          }
        })

        promise
          .then(function () {
            expect(forkSuccessfulReceived).toBe(true)
            done()
          })
          .done()
      })
    })

    it('should receive message from child when using "progress"', () => {
      return new Promise(done => {
        const scriptpath = path.join(__dirname, 'fixtures/fork.js')
        const promise = childProcessPromise.fork(scriptpath, ['foo'])

        let forkSuccessfulReceived = false

        promise
          .progress(function (childProcess) {
            childProcess.on('message', function (message) {
              if (message && message.type === 'forkSuccessful') {
                forkSuccessfulReceived = true
              }
            })
          })
          .then(function () {
            expect(forkSuccessfulReceived).toBe(true)
            done()
          })
          .done()
      })
    })
  })
})
