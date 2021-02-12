export default queryString =>
  queryString
    .replace('?', '')
    .split('&')
    .map(item => item.split('='))
    .filter(([, value]) => value)
    .reduce(
      (obj, [key, value]) => ({
        ...obj,
        [key]: obj[key]
          ? (Array.isArray(obj[key]) && [...obj[key], decodeURI(value)]) || [
              obj[key],
              decodeURI(value),
            ]
          : decodeURI(value),
      }),
      {},
    )
