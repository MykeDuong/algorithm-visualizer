{#key updateCell}
<div
  class={`cell ${setRole()} ${setStatus()} `}
  id={`${i} ${j}`}
>
{i} {j}
</div>
{/key}

<style>
  .cell {
    width: 30px;
    margin: 1px;

    font-size: 0.5rem;
    color: white;
  }

  .normal {
    background-color: var(--dark-color-2);
  }

  .start {
    background-color: var(--highlight-color-0);
  }

  .destination {
    background-color: var(--light-color-0)
  }

  .visiting {
    background-color: var(--highlight-color-0);
  }

  .visited {
    background-color: var(--dark-color-0);
  }

  .path {
    background-color: var(--yellow-color);
  }
</style>

<script lang='ts'>
  import CellModel, { Role, Status } from './Cell';

  export let cell: CellModel, i: number, j: number;
  export let grid: CellModel[][];
  let updateCell: number = 0;

  const setRole = () => {
    if (grid[i][j].role === Role.Start) return 'start'
    
    if (grid[i][j].role === Role.Destination) return 'destination'
    
    return 'normal'
  }

  const setStatus = () => {
    if (grid[i][j].status === Status.Visiting) {return 'visiting'}
    
    if (grid[i][j].status === Status.Visited) return 'visited'

    if (grid[i][j].status === Status.Path) return 'path'

    return 'normal'
  }

  export const update = () => {
    updateCell++;
  }

</script>