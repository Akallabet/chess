export const pipe = (...fns) => (x) => fns.reduce((y, fn) => fn(y), x)
export const check = (condition, yes, no = () => {}) => (input) =>
  condition(input) ? yes(input) : no(input)

export const createContext = (context) => (fns) => {
  const ret = {}
  for (const fn in fns) {
    ret[fn] = fns[fn](context)
  }
  return ret
}
