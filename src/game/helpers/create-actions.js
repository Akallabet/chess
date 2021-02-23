export const createActions = ({ pieces, ranks, files }) => [
  [
    `^[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([file, rank]) => ({ name: pieces.P, y: ranks.indexOf(rank), x: files.indexOf(file) }),
  ],
  [
    `^[${Object.values(pieces)}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([name, file, rank]) => ({ name, y: ranks.indexOf(rank), x: files.indexOf(file) }),
  ],
  [
    `^[${Object.values(pieces).join('')}]{1}[${files.join('')}]{1}[${files.join(
      ''
    )}]{1}[${ranks.join('')}]{1}$`,
    ([name, originFile, file, rank]) => ({
      name,
      originX: files.indexOf(originFile),
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
    }),
  ],
  [
    `^[${Object.values(pieces).join('')}]{1}[${files.join('')}]{1}[${ranks.join(
      ''
    )}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([name, originFile, originRank, file, rank]) => ({
      name,
      originX: files.indexOf(originFile),
      originY: ranks.indexOf(originRank),
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
    }),
  ],
  [
    `^[${files.join('')}]{1}x[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([, , file, rank]) => ({
      name: pieces.P,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      capture: true,
    }),
  ],
  [
    `^[${Object.values(pieces).join('')}]{1}x[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([name, , file, rank]) => ({
      name,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      capture: true,
    }),
  ],
  [
    `^[${files.join('')}]{1}x[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([name, , file, rank]) => {
      console.log('lalalalalal')
      return {
        name,
        y: ranks.indexOf(rank),
        x: files.indexOf(file),
        capture: true,
        enPassant: true,
      }
    },
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
