import CellModel, { Status } from './Cell';
import Cell from './Cell.svelte';
const directions = [[0, -1], [0, 1], [-1, 0], [1, 0] ]

export const bfs = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  const m = grid.length;
  const n = grid[0].length;

  const q: number[][] = [[startRow, startCol]];

  const visited = new ArraySet();
  visited.add([startRow, startCol]);

  while (q.length !== 0) {
    const [r, c] = <number[]>q.shift();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();

    if (r === desRow && c === desCol) break

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue


      q.push([nr, nc])
      visited.add([nr, nc]);

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, 10));
    }
  }
}

export const dfs = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  const m = grid.length;
  const n = grid[0].length;

  const s: number[][] = [[startRow, startCol]];

  const visited = new ArraySet();
  visited.add([startRow, startCol]);

  while (s.length !== 0) {
    const [r, c] = <number[]>s.pop();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();

    if (r === desRow && c === desCol) break

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue


      s.push([nr, nc])
      visited.add([nr, nc]);

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, 5));
    }
  }
}

class ArraySet extends Set<string> {
  add(arr: any) {
    super.add(arr.toString());
    return this
  }
  has(arr: any) {
    return super.has(arr.toString());
  }
}