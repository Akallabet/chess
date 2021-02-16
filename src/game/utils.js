export const pipe = (...fns) => (x) => fns.reduce((y, fn) => fn(y), x)
export const check = (condition, yes, no = (input) => input) => (input) =>
  condition(input) ? yes(input) : no(input)

export const when = (...fns) => (x) => fns.reduce((y, fn) => y && fn(x), x)

export const createContext = (...fns) => (context) => fns.map((fn) => fn(context))
export const log = (label) => (args) => {
  console.log(label, args)
  return args
}

export const isDefined = (input) => !!input
export const noop = () => {}
