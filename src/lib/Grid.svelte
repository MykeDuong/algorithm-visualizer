<div class="app__grid">
  <div class="grid">
    {#each grid as r, i}
      <div class="row">
        {#each r as cell, j}
          <Cell bind:cell={grid[i][j]} {i} {j} {grid} bind:this={gridView[i][j]} />
        {/each}
      </div>
    {/each}
  </div>
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
  import CellModel, { Role, Status } from './Cell';
  import Cell from './Cell.svelte'
  import { bfs, dfs } from './Algorithms';
  import { visualizeAlgorithm } from './stores';

  const row = 31
  const col = 40

  let grid: CellModel[][] = Array(row);
  let gridView: Cell[][] = [...Array(row)].map(e => Array(col));

  for (let i = 0; i < row; i++) {
    grid[i] = Array(col);
    for (let j = 0; j < col; j++) {
      grid[i][j] = new CellModel()
    }
  }

  // Create start cell
  const startRow = Math.floor(Math.random() * (row));
  const startCol = Math.floor(Math.random() * (col));
  grid[startRow][startCol].setStart();

  // Create destination cell
  const desRow = Math.floor(Math.random() * (row));
  const desCol = Math.floor(Math.random() * (col));
  grid[desRow][desCol].setDestination();

  visualizeAlgorithm.subscribe(async value => {
    switch (value) {
      case "Breath-first Search": {
        reset();
        bfs(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
      case "Depth-first Search": {
        reset();
        dfs(startRow, startCol, desRow, desCol, grid, gridView);
        break;
      }
    }
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