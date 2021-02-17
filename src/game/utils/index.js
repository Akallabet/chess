export const pipe = (...fns) => (x) => fns.reduce((y, fn) => fn(y), x)
export const pipeCond = (...fns) => (x) => {
  let res = x
  for (const [cond, then, otherwise] of fns) {
    if (cond(res)) return then(res)
    res = otherwise(res)
  }
}

// export const cond = (condition, then) => x => condition(x) ? then(x)

export const check = (condition, yes, no = (input) => input) => (input) =>
  condition(input) ? yes(input) : no(input)

export const when = (...fns) => (x) => fns.reduce((y, fn) => y && fn(x), x)
export const isDefined = (input) => !!input
export const noop = () => {}
export const identity = (input) => input
export const log = (label) => (args) => {
  console.log(label, args)
  return args
}
