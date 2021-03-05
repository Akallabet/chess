export const pipe = (...fns) => (x) => fns.reduce((y, fn) => fn(y), x)
export const pipeCond = (...fns) => (x) => {
  let res = x
  for (const [cond, then, otherwise] of fns) {
    if (cond(res)) return then(res)
    res = otherwise(res)
  }
}

export const when = (...fns) => (x) => fns.reduce((y, fn) => y && fn(x), x)
export const isDefined = (input) => !!input
export const noop = () => {}
export const identity = (input) => input
export const falsy = () => false
export const isTruthy = (value) => !!value
export const isFalsy = (value) => !value
export const log = (label) => (args) => {
  console.log(label, args)
  return args
}
export const operation = (fn) => (args) => {
  fn(args)
  return args
}
export const flatten = (arr) =>
  arr.reduce((ret, res) => [...ret, ...(Array.isArray(...res) ? flatten(res) : res)], [])

export const ifElse = (condition, then, otherwise = identity) => (input) =>
  condition(input) ? then(input) : otherwise(input)
