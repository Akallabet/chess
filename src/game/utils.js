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

const byName = (name) => (origin) => (name ? origin.name === name : true)
const byFile = (x) => (origin) => (x ? origin.x === x : true)
const byRank = (y) => (origin) => (y ? origin.y === y : true)

export const filterByName = (name) => (origins) => origins.filter(byName(name))
export const filterByFile = (x) => (origins) => origins.filter(byFile(x))
export const filterByRank = (y) => (origins) => origins.filter(byRank(y))
