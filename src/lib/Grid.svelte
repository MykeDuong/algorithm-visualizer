<div
  class="app__grid"
  bind:clientWidth={boxWidth}
  bind:clientHeight={boxHeight}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
>
  {#if (boxWidth !== 0 && boxWidth !== undefined && boxWidth !== null)}
    <div class="grid">
      {#each grid as r, i}
        <div class="row">
          {#each r as _cell, j}
            <Cell bind:cell={grid[i][j]} {i} {j} {grid} bind:this={gridView[i][j]} />
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .app__grid {
    position: fixed;
    margin-left: 23%;
    width: 77%;
    height: 100%;
    background-color: var(--dark-color-2);
    
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .grid {
    border: 1px solid var(--light-color-3);

    display: flex;
    flex-direction: column;
    background-color: var(--light-color-3);
  }

  .row {
    height: 30px;
    display: flex;
    flex-direction: row;
  }
</style>

<script lang='ts'>
  import { onMount } from 'svelte';

  import CellModel, { Role } from './Cell';
  import Cell from './Cell.svelte'
  import { aStar, bfs, dfs, dijkstra, greedyBfs, kruskal, prim, randomMaze } from './Algorithms';
  import { visualizeAlgorithmStore, lockStore, gridMouseDownStore, startCellStore, desCellStore, selectedCellRoleStore } from './stores';

  let boxWidth: number = 0;
  let boxHeight: number = 0;

  let row: number = 10;
  let col: number = 10;

  let grid: CellModel[][];
  let gridView: Cell[][];

  // Create start cell
  let startRow = 0;
  let startCol = 0;

  // Create destination cell
  let desRow = 0;
  let desCol = 0;
  let initialized = false;

  onMount(async () => {
    row = Math.floor(boxHeight / 31)
    col = Math.floor(boxWidth / 32) 
    grid = Array(row);
    gridView= [...Array(row)].map(e => Array(col));

    for (let i = 0; i < row; i++) {
      grid[i] = Array(col);
      for (let j = 0; j < col; j++) {
        grid[i][j] = new CellModel()
      }
    }

    // Create start cell
    startRow = Math.floor(Math.random() * (row));
    startCol = Math.floor(Math.random() * (col));
    
    // Create destination cell
    desRow = Math.floor(Math.random() * (row));
    desCol = Math.floor(Math.random() * (col));
    
    startCellStore.set([startRow ,startCol]);
    desCellStore.set([desRow, desCol]);
    
    await new Promise(f => setTimeout(f, 10))
    initialized = true
  })

  startCellStore.subscribe(value => {
    console.log(startRow, startCol);
    if (!grid) return

    if (initialized) {
      grid[startRow][startCol].setRole(Role.Normal);
      gridView[startRow][startCol].update();
      startRow = value[0]
      startCol = value[1]
    }
    
    grid[value[0]][value[1]].setStart();
    if (initialized) {
      gridView[value[0]][value[1]].update();
    }
  })

  desCellStore.subscribe(value => {
    if (!grid) return

    if (initialized) {
      grid[desRow][desCol].setRole(Role.Normal);
      gridView[desRow][desCol].update()
      desRow = value[0]
      desCol = value[1]
    }
    
    grid[value[0]][value[1]].setDestination();
    if (initialized) {
      gridView[value[0]][value[1]].update();
    }
  })

  visualizeAlgorithmStore.subscribe(async value => {
    grid = grid;
    if (!grid) return

    lockStore.set(true);
    switch (value) {
      case "clean": {
        clean();
        break;
      }
      case "reset": {
        reset();
        break;
      }
      case "Breath-first Search": {
        await bfs(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
      case "Depth-first Search": {
        await dfs(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
      case "Dijkstra's Algorithm": {
        await dijkstra(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
      case "Greedy Best-first Search": {
        await greedyBfs(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
      case "A* Search": {
        await aStar(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
      case "Kruskal-based Generation": {
        await kruskal(grid, gridView);
        break;
      }
      case "Prim-based Generation": {
        await prim(grid, gridView);
        break;
      }
      case "Random Generation": {
        await randomMaze(grid, gridView);
        break;
      }
    }
    lockStore.set(false);
  })

  const clean = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        grid[i][j].clean()
        gridView[i][j].update();
      }
    }
  }

  const reset = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        grid[i][j].reset()
        gridView[i][j].update();
      }
    }
  }

  const handleMouseDown = () => {
    gridMouseDownStore.set(true);
  }

  const handleMouseUp = () => {
    gridMouseDownStore.set(false);
  }

</script>