import type { Address, Files, MetaData, Ranks } from './types.js';
import { files, ranks } from './constants.js';

function getPositions(files: Files, ranks: Ranks): Array<Array<Address>> {
  const positions = [];
  for (let i = 0; i < ranks.length; i++) {
    const row: Address[] = [];
    for (let j = 0; j < files.length; j++) {
      const address = `${files[j]}${ranks[i]}`;
      row.push(address);
    }
    positions.push(row);
  }
  return positions;
}

export function getMetadata(): MetaData {
  return {
    files,
    ranks,
    positions: getPositions(files, ranks),
  };
}
