import { construct_svelte_component } from 'svelte/internal';
import CellModel, { Status } from './Cell';
import Cell from './Cell.svelte';
import PriorityQueue from 'priority-queue-typescript';

const directions = [[0, -1], [-1, 0], [0, 1], [1, 0] ]

const defaultDelay = 5;

// Algorithms
export const bfs = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  const m = grid.length;
  const n = grid[0].length;

  const parents: number[][][] = Array(m)

  for (let i = 0; i < m; i++) {
    parents[i] = Array(n)
    for (let j = 0; j < n; j++) {
      parents[i][j] = [];
    }
  }

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

      parents[nr][nc] = [r, c]
      q.push([nr, nc])
      visited.add([nr, nc]);

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  const path = tracePath(startRow, startCol, desRow, desCol, parents)
  visualizePath(path, grid, gridView);
}

export const dfs = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  const m = grid.length;
  const n = grid[0].length;

  const parents: number[][][] = Array(m)

  for (let i = 0; i < m; i++) {
    parents[i] = Array(n)
    for (let j = 0; j < n; j++) {
      parents[i][j] = [];
    }
  }

  const s: number[][] = [[startRow, startCol]];

  const visited = new ArraySet();
  visited.add([startRow, startCol]);

  while (s.length !== 0) {
    const [r, c] = <number[]>s.pop();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();

    visited.add([r, c]);

    if (r === desRow && c === desCol) break

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue

      parents[nr][nc] = [r, c]
      s.push([nr, nc])

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  const path = tracePath(startRow, startCol, desRow, desCol, parents)
  await visualizePath(path, grid, gridView);
}

export const dijkstra = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  class Position {
    d: number;
    r: number;
    c: number;

    constructor(d: number, r: number, c: number) {
      this.d = d;
      this.r = r;
      this.c = c;
    }
  }
  
  const m = grid.length;
  const n = grid[0].length;

  const parents: number[][][] = Array(m)
  for (let i = 0; i < m; i++) {
    parents[i] = Array(n)
    for (let j = 0; j < n; j++) {
      parents[i][j] = [];
    }
  }

  const distMap: number[][] = Array(m)
  for (let i = 0; i < m; i++) {
    distMap[i] = Array(n)
    for (let j = 0; j < n; j++) {
      distMap[i][j] = Number.MAX_VALUE      
    }
  }
  distMap[startRow][startCol] = 0

  const pq = new PriorityQueue<Position>(
    m * n,
    (a: Position, b: Position) => (a.d - b.d)
  )

    pq.add(new Position(0, startRow, startCol));

  const visited = new ArraySet();

  while (pq.size() !== 0) {
    const { d, r, c } = <Position>pq.poll();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();
    visited.add([r, c]);

    if (r === desRow && c === desCol) break

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const nr = r + direction[0];
      const nc = c + direction[1];
      const nd = d + 1;

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue
      if (distMap[nr][nc] <= nd) continue

      distMap[nr][nc] = nd
      parents[nr][nc] = [r, c]

      pq.add(new Position(nd, nr, nc))

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  const path = tracePath(startRow, startCol, desRow, desCol, parents)
  await visualizePath(path, grid, gridView);
}

export const greedyBfs = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  class Position {
    w: number;
    r: number;
    c: number;

    constructor(w: number, r: number, c: number) {
      this.w = w;
      this.r = r;
      this.c = c;
    }
  }

  // Heuristic: Euclidean Distance
  const euclideanDistance = (curRow: number, curCol: number) => {
    return Math.pow((curRow - desRow), 2) + Math.pow((curCol - desCol), 2)
  }

  const m = grid.length;
  const n = grid[0].length;

  const parents: number[][][] = Array(m)
  for (let i = 0; i < m; i++) {
    parents[i] = Array(n)
    for (let j = 0; j < n; j++) {
      parents[i][j] = [];
    }
  }

  const weightMap: number[][] = Array(m)
  for (let i = 0; i < m; i++) {
    weightMap[i] = Array(n)
    for (let j = 0; j < n; j++) {
      weightMap[i][j] = Number.MAX_VALUE      
    }
  }
  weightMap[startRow][startCol] = euclideanDistance(startRow, startCol)

  const pq = new PriorityQueue<Position>(
    m * n,
    (a: Position, b: Position) => (a.w - b.w)
  )
  pq.add(new Position(euclideanDistance(startRow, startCol), startRow, startCol));

  const visited = new ArraySet();
  visited.add([startRow, startCol]);

  while (pq.size() !== 0) {
    const { w, r, c } = <Position>pq.poll();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();
    visited.add([r, c]);

    if (r === desRow && c === desCol) break

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];
      const nw = euclideanDistance(r, c);

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue
      if (weightMap[nr][nc] <= nw) continue

      weightMap[nr][nc] = nw
      parents[nr][nc] = [r, c]
      pq.add(new Position(nw, nr, nc))

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  const path = tracePath(startRow, startCol, desRow, desCol, parents)
  await visualizePath(path, grid, gridView);
}

export const aStar = async (startRow: number, startCol: number, desRow: number, desCol: number, grid: CellModel[][], gridView: Cell[][]) => {
  class Position {
    d: number;
    h: number;
    r: number;
    c: number;

    constructor(d: number, h:number, r: number, c: number) {
      this.d = d;
      this.h = h;
      this.r = r;
      this.c = c;
    }
  }
  
  const heuristic = (curRow: number, curCol: number) => {
    return Math.abs(curRow - desRow) + Math.abs(curCol - desCol);
  }

  const m = grid.length;
  const n = grid[0].length;

  const parents: number[][][] = Array(m)
  for (let i = 0; i < m; i++) {
    parents[i] = Array(n)
    for (let j = 0; j < n; j++) {
      parents[i][j] = [];
    }
  }

  const valMap: number[][] = Array(m)
  for (let i = 0; i < m; i++) {
    valMap[i] = Array(n)
    for (let j = 0; j < n; j++) {
      valMap[i][j] = Number.MAX_VALUE      
    }
  }
  valMap[startRow][startCol] = 0 + heuristic(startRow, startCol)

  const pq = new PriorityQueue<Position>(
    m * n,
    (a: Position, b: Position) => (a.d + a.h - b.d - b.h)
  )

    pq.add(new Position(0, heuristic(startRow, startCol), startRow, startCol));

  const visited = new ArraySet();

  while (pq.size() !== 0) {
    const { d, h, r, c } = <Position>pq.poll();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();
    visited.add([r, c]);

    if (r === desRow && c === desCol) break

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const nr = r + direction[0];
      const nc = c + direction[1];
      const nd = d + 1;
      const nh = heuristic(nr, nc);

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue
      if (valMap[nr][nc] <= nd + nh) continue

      valMap[nr][nc] = nd + nh
      parents[nr][nc] = [r, c]

      pq.add(new Position(nd, nh, nr, nc))

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  const path = tracePath(startRow, startCol, desRow, desCol, parents)
  await visualizePath(path, grid, gridView);
}

export const visualizePath = async (path: number[][], grid: CellModel[][], gridView: Cell[][]) => {
  for (const cell of path) {
    const [r, c] = cell;
    grid[r][c].setStatus(Status.Path);
    gridView[r][c].update();
    await new Promise(f => setTimeout(f, defaultDelay));
  }
}

const tracePath = (startRow: number, startCol: number, desRow: number, desCol: number, parents: number[][][]) => {
  let r = desRow;
  let c = desCol;

  const path: number[][] = []
  while (r !== startRow || c !== startCol) {
    path.push([r, c]);

    [r, c] = parents[r][c]
  }
  path.push([r, c]);
  return path.reverse();
}

// Data Structures
class ArraySet extends Set<string> {
  add(arr: any) {
    super.add(arr.toString());
    return this
  }
  has(arr: any) {
    return super.has(arr.toString());
  }
}