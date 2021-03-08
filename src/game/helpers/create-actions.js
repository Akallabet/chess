export const createActions = ({ pieces, ranks, files }) => [
  [
    `^[${files.join('')}]{1}[${ranks.join('')}]{1}[+]*$`,
    ([file, rank, check]) => ({
      name: pieces.P,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      check,
    }),
  ],
  [
    `^[${files.join('')}]{1}[${ranks.join('')}]{1}[${Object.values(pieces)}]{1}[+]*$`,
    ([file, rank, promotion, check]) => ({
      name: pieces.P,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      promotion,
      check,
    }),
  ],
  [
    `^[${Object.values(pieces)}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}[+]*$`,
    ([name, file, rank, check]) => ({
      name,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      check,
    }),
  ],
  [
    `^[${Object.values(pieces).join('')}]{1}[${files.join('')}]{1}[${files.join(
      ''
    )}]{1}[${ranks.join('')}]{1}[+]*$`,
    ([name, originFile, file, rank, check]) => ({
      name,
      originX: files.indexOf(originFile),
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      check,
    }),
  ],
  [
    `^[${Object.values(pieces).join('')}]{1}[${files.join('')}]{1}[${ranks.join(
      ''
    )}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}[+]*$`,
    ([name, originFile, originRank, file, rank, check]) => ({
      name,
      originX: files.indexOf(originFile),
      originY: ranks.indexOf(originRank),
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      check,
    }),
  ],
  [
    `^[${files.join('')}]{1}x[${files.join('')}]{1}[${ranks.join('')}]{1}[+]*$`,
    ([originX, , file, rank, check]) => ({
      name: pieces.P,
      originX: files.indexOf(originX),
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      capture: true,
      check,
    }),
  ],
  [
    `^[${Object.values(pieces).join('')}]{1}x[${files.join('')}]{1}[${ranks.join('')}]{1}[+]*$`,
    ([name, , file, rank, check]) => ({
      name,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      capture: true,
      check,
    }),
  ],
  [
    `^0-0$`,
    () => ({
      name: 'K',
      isCastling: true,
      isKingside: true,
    }),
  ],
  [
    `^0-0-0$`,
    () => ({
      name: 'K',
      isCastling: true,
      isQueenside: true,
    }),
  ],
]
