export class NotFoundError extends Error {
  constructor(...arg) {
    super(...arg)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(...arg) {
    super(...arg)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  constructor(...arg) {
    super(...arg)
    this.name = 'NetworkError'
  }
}
