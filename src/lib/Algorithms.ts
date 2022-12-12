import { construct_svelte_component } from 'svelte/internal';
import CellModel, { Status, Role } from './Cell';
import Cell from './Cell.svelte';
import PriorityQueue from 'priority-queue-typescript';
import { desCellStore, startCellStore } from './stores';

const directions = [[0, -1], [-1, 0], [0, 1], [1, 0] ]

const defaultDelay = 0;

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

  let found = false;

  while (q.length !== 0) {
    const [r, c] = <number[]>q.shift();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();

    if (r === desRow && c === desCol) {
      found = true;
      break;
    }

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (grid[nr][nc].role === Role.Block) continue
      if (visited.has([nr, nc])) continue

      parents[nr][nc] = [r, c]
      q.push([nr, nc])
      visited.add([nr, nc]);

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  if (found) {
    const path = tracePath(startRow, startCol, desRow, desCol, parents)
    visualizePath(path, grid, gridView);
  }
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

  let found = false;

  while (s.length !== 0) {
    const [r, c] = <number[]>s.pop();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();

    visited.add([r, c]);

    if (r === desRow && c === desCol) {
      found = true
      break
    }

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (grid[nr][nc].role === Role.Block) continue
      if (visited.has([nr, nc])) continue

      parents[nr][nc] = [r, c]
      s.push([nr, nc])

      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }

  if (found) {
    const path = tracePath(startRow, startCol, desRow, desCol, parents)
    visualizePath(path, grid, gridView);
  }
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

  let found = false;

  while (pq.size() !== 0) {
    const { d, r, c } = <Position>pq.poll();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();
    visited.add([r, c]);

    if (r === desRow && c === desCol) {
      found = true
      break
    }

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const nr = r + direction[0];
      const nc = c + direction[1];
      const nd = d + 1;

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (grid[nr][nc].role === Role.Block) continue
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
  if (found) {
    const path = tracePath(startRow, startCol, desRow, desCol, parents)
    visualizePath(path, grid, gridView);
  }
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

  let found = false;

  while (pq.size() !== 0) {
    const { w, r, c } = <Position>pq.poll();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();
    visited.add([r, c]);

    if (r === desRow && c === desCol) {
      found = true
      break;
    }

    for (let i = 0; i < directions.length; i++) {
      const d = directions[i];
      const nr = r + d[0];
      const nc = c + d[1];
      const nw = euclideanDistance(r, c);

      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (visited.has([nr, nc])) continue
      if (weightMap[nr][nc] <= nw) continue
      if (grid[nr][nc].role === Role.Block) continue

      weightMap[nr][nc] = nw
      parents[nr][nc] = [r, c]
      pq.add(new Position(nw, nr, nc))
      grid[nr][nc].setStatus(Status.Visiting);
      gridView[nr][nc].update();

      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }
  if (found) {
    const path = tracePath(startRow, startCol, desRow, desCol, parents)
    visualizePath(path, grid, gridView);
  }
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

  let found = false;

  while (pq.size() !== 0) {
    const { d, h, r, c } = <Position>pq.poll();

    grid[r][c].setStatus(Status.Visited);
    gridView[r][c].update();
    visited.add([r, c]);

    if (r === desRow && c === desCol) {
      found = true
      break;
    }

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const nr = r + direction[0];
      const nc = c + direction[1];
      const nd = d + 1;
      const nh = heuristic(nr, nc);
      
      
      if ((nr < 0) || (nc < 0) || (nr >= m) || (nc >= n)) continue
      if (grid[nr][nc].role === Role.Block) continue
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
  if (found) {
    const path = tracePath(startRow, startCol, desRow, desCol, parents)
    visualizePath(path, grid, gridView);
  }
}

export const kruskal = async (grid: CellModel[][], gridView: Cell[][]) => {
  const m = grid.length;
  const n = grid[0].length;

  const { edgeArray, normalCell, parents } = await generateWalledGrid(grid, gridView);

  // Kruskal + Union-find
  while (edgeArray.length > 0) {
    const edge = <number[]>edgeArray.pop();
    const nodes = getNodes(edge);

    if (nodes.length === 0) continue;
  
    const [[r1, c1], [r2, c2]] = nodes

    if (r1 < 0 || c1 < 0 || r2 < 0 || c2 < 0 || r1 >= m || r2 >= m || c1 >= n || c2 >= n) continue
    
    const p1 = find([r1, c1], parents)
    const p2 = find([r2, c2], parents)

    if (p1 === p2) continue

    parents[p1[0]][p1[1]] = p2
    
    normalCell.push([edge[0], edge[1]])
    grid[edge[0]][edge[1]].setRole(Role.Normal)
    gridView[edge[0]][edge[1]].update();
    await new Promise(f => setTimeout(f, defaultDelay));
  }

  setEndPoints(normalCell);
}

export const prim = async (grid: CellModel[][], gridView: Cell[][]) => {
  const walledGridDirections = [[0, -2], [0, 2], [2, 0], [-2, 0]]
  const m = grid.length;
  const n = grid[0].length;

  const { normalCell } = await generateWalledGrid(grid, gridView);

  const frontier = new ArraySet();
  
  shuffleArray(normalCell)
  const root = normalCell[0];

  // Set of nodes in Tree
  const tree = new ArraySet();
  tree.add(root);

  // Initialize frontier
  let d = []
  for (d of walledGridDirections) {
    const nr = root[0] + d[0]
    const nc = root[1] + d[1]
    if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue
    frontier.add([nr, nc])
  }

  while (frontier.size !== 0) {
    let frontierCell: any[] = [0, 0];
    
    // Random cell
    const randomIndex = Math.floor(Math.random() * frontier.size);
    let i = 0;
    for (const value of frontier) {
      if (i === randomIndex) {
        frontier.delete(value);
        frontierCell = value.split(',');

        for (let i = 0; i < frontierCell.length; i++) {
          frontierCell[i] = parseInt(frontierCell[i]);
        }
        break;
      }
      i++;
    }

    // Connect to current tree
    for (d of walledGridDirections) {
      const nr = frontierCell[0] + d[0]
      const nc = frontierCell[1] + d[1]

      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue

      if (!tree.has([nr, nc])) continue

      tree.add([frontierCell[0], frontierCell[1]])

      const connectingRow = (nr + frontierCell[0]) / 2;
      const connectingCol = (nc + frontierCell[1]) / 2;

      normalCell.push([connectingRow, connectingCol])
      grid[connectingRow][connectingCol].setRole(Role.Normal)
      gridView[connectingRow][connectingCol].update();

      break;
    }

    // Update frontier
    for (d of walledGridDirections) {
      const nr = frontierCell[0] + d[0]
      const nc = frontierCell[1] + d[1]

      if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue

      if (tree.has([nr, nc])) continue

      frontier.add([nr, nc])
    }
    await new Promise(f => setTimeout(f, defaultDelay));
  }

  setEndPoints(normalCell);
}

export const randomMaze = async (grid: CellModel[][], gridView: Cell[][]) => {
  const { edgeArray, normalCell } = await generateWalledGrid(grid, gridView);

  while (edgeArray.length > 0) {
    const edge = <number[]>edgeArray.pop();
    const rand = Math.random();
    if (rand > 0.4) {
      normalCell.push(edge);
      grid[edge[0]][edge[1]].setRole(Role.Normal);
      gridView[edge[0]][edge[1]].update();
      await new Promise(f => setTimeout(f, defaultDelay));
    }
  }

  setEndPoints(normalCell);
}

// Helper functions
const visualizePath = async (path: number[][], grid: CellModel[][], gridView: Cell[][]) => {
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

const getNodes = (edge: number[]) => {
  const [r, c] = edge;
  if (r % 2 === 0 && c % 2 !== 0) { 
    return [[r - 1, c], [r + 1, c]]
  } else if (r % 2 !== 0 && c % 2 === 0) {
    return [[r, c - 1], [r, c + 1]]
  } else {
    return [];
  }
}

const generateWalledGrid = async (grid: CellModel[][], gridView: Cell[][]) => {
  const m = grid.length;
  const n = grid[0].length;

  let r;
  let c;

  // Full Reset
  for (r = 0; r < m; r++) {
    for (c = 0; c < n; c++) {
      grid[r][c].fullReset()
      gridView[r][c].update();
    }
  }

  const edgeArray: number[][] = [];
  const normalCell: number[][] = []
  const parents: number[][][] = Array(m)

  for (r = 0; r < m; r++) {
    parents[r] = Array(n);
    for (c = 0; c < n; c++) {
      if (r % 2 === 0 || c % 2 === 0) {
        grid[r][c].setRole(Role.Block);
        gridView[r][c].update()
        await new Promise(f => setTimeout(f, defaultDelay));
        if (r % 2 !== 0 || c % 2 !== 0) {
          edgeArray.push([r, c])
        }
        parents[r][c] = [-1, -1]
      } else {
        parents[r][c] = [r, c]
        normalCell.push([r, c])
      }
    }
  }

  shuffleArray(edgeArray);

  return { edgeArray, normalCell, parents }
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

const setEndPoints = (normalCell: number[][]) => {
  //set new start & destination
  shuffleArray(normalCell);

  //Start
  const start = <number[]>normalCell.pop();
  startCellStore.set(start)

  // Desination
  const des = <number[]>normalCell.pop();
  desCellStore.set(des);
}

const find = (node: number[], parents: number[][][]) => {
  const [r, c] = node;
  if (parents[r][c].length === 0) return [-1, -1]
  if (parents[r][c][0] !== r || parents[r][c][1] !== c) {
    parents[r][c] = find([parents[r][c][0], parents[r][c][1]], parents)
  }
  return parents[r][c]
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