'use strict'

class ChildProcessPromise extends Promise {
  constructor(executor) {
    let resolve
    let reject

    super((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject

      if (executor) {
        executor(resolve, reject)
      }
    })

    this._cpResolve = resolve
    this._cpReject = reject
    this.childProcess = undefined
  }

  progress(callback) {
    process.nextTick(() => {
      callback(this.childProcess)
    })

    return this
  }

  then(onFulfilled, onRejected) {
    const newPromise = super.then(onFulfilled, onRejected)
    newPromise.childProcess = this.childProcess
    return newPromise
  }

  catch(onRejected) {
    const newPromise = super.catch(onRejected)
    newPromise.childProcess = this.childProcess
    return newPromise
  }

  done() {
    this.catch(e => {
      process.nextTick(() => {
        throw e
      })
    })
  }
}

ChildProcessPromise.prototype.fail = ChildProcessPromise.prototype.catch

module.exports = ChildProcessPromise
