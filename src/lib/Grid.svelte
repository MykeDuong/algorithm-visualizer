<div class="app__grid" bind:clientWidth={boxWidth} bind:clientHeight={boxHeight}>
  {#if (boxWidth !== 0)}
    <div class="grid">
      {#each grid as r, i}
        <div class="row">
          {#each r as cell, j}
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

  import CellModel, { Role, Status } from './Cell';
  import Cell from './Cell.svelte'
  import { aStar, bfs, dfs, dijkstra, greedyBfs } from './Algorithms';
  import { visualizeAlgorithm, lock } from './stores';

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

  onMount(() => {
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
    grid[startRow][startCol].setStart();

    // Create destination cell
    desRow = Math.floor(Math.random() * (row));
    desCol = Math.floor(Math.random() * (col));
    grid[desRow][desCol].setDestination();
  })

  visualizeAlgorithm.subscribe(async value => {
    if (!grid) return
    lock.set(true);
    switch (value) {
      case "clean": {
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
    }
    lock.set(false);
  })

  const reset = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        grid[i][j].reset()
        gridView[i][j].update();
      }
    }
  }

</script>