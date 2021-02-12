export const compose = (...fns) => (x) => fns.reduce((y, fn) => fn(y), x)

export const createContext = (context) => (fns) => {
  const ret = {}
  for (const fn in fns) {
    ret[fn] = fns[fn](context)
  }
  return ret
}
