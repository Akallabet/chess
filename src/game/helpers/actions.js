export const actions = ({ PIECES, ranks, files }) => [
  [
    `^[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([file, rank]) => ({ y: ranks.indexOf(rank), x: files.indexOf(file) }),
  ],
  [
    `^[${PIECES.names}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([name, file, rank]) => ({ name, y: ranks.indexOf(rank), x: files.indexOf(file) }),
  ],
  [
    `^[${PIECES.names.join('')}]{1}[${files.join('')}]{1}[${files.join('')}]{1}[${ranks.join(
      ''
    )}]{1}$`,
    ([name, originFile, file, rank]) => ({
      name,
      originX: files.indexOf(originFile),
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
    }),
  ],
  [
    `^[${PIECES.names.join('')}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}[${files.join(
      ''
    )}]{1}[${ranks.join('')}]{1}$`,
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
      name: PIECES.get('P').name,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      capture: true,
    }),
  ],
  [
    `^[${PIECES.names.join('')}]{1}x[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
    ([name, , file, rank]) => ({
      name,
      y: ranks.indexOf(rank),
      x: files.indexOf(file),
      capture: true,
    }),
  ],
]
