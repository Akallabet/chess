import type { ChessBoardAddress, Files, MetaData, Ranks } from './types.js';
import { files, ranks } from './constants.js';

function getPositions(files: Files, ranks: Ranks): ChessBoardAddress[][] {
  const positions = [];
  for (const rank of ranks) {
    const row: ChessBoardAddress[] = [];
    for (const file of files) {
      row.push(`${file}${rank}`);
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
