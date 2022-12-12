{#key updateCell}
  <div
    class={`cell ${setStatus()} `}
    id={`${i} ${j}`}
    on:mousemove={handleMouseMove}
    on:mousedown={handleSelectCellRole}
  >
    {#if (toggleDebug)}
      <p>{i} {j}</p>
    {/if}
    {#if grid[i][j].role === Role.Start}
      <div>
        <Icon icon="material-symbols:arrow-circle-right-rounded" color={theme.colors.lightColor1} />
      </div>
    {:else if grid[i][j].role === Role.Destination}
      <div>
        <Icon icon="tabler:target" color={theme.colors.highlightColor0} />
      </div>
    {:else if grid[i][j].role === Role.Block}
      <div>
        <Icon icon="game-icons:brick-wall" color={theme.colors.lightColor1} />
      </div>
    {/if}
  </div>
{/key}

<style>
  .cell {
    position: relative;
    width: 30px;
    margin: 1px;
    color: white;
  }

  .normal {
    background-color: var(--dark-color-2);
  }

  .start {
    background-color: var(--highlight-color-0);
  }

  .destination {
    background-color: var(--light-color-0);
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

  p {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    color: white;
    font-size: 0.5rem;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
  }

</style>

<script lang='ts'>
  import Icon from '@iconify/svelte';
  import { get } from 'svelte/store'
  
  import { debugStore, desCellStore, gridMouseDownStore, selectedCellRoleStore, startCellStore } from '$lib/stores'
  import CellModel, { Role, Status } from './Cell';
	import theme from './theme';

  export let cell: CellModel, i: number, j: number;
  export let grid: CellModel[][];
  
  let updateCell: number = 0;
  let toggleDebug: boolean
  let mouseDown: boolean

  debugStore.subscribe(value => {
    toggleDebug = value;
  })

  const setStatus = () => {
    if (grid[i][j].status === Status.Visiting) {return 'visiting'}
    
    if (grid[i][j].status === Status.Visited) return 'visited'

    if (grid[i][j].status === Status.Path) return 'path'

    return 'normal'
  }

  export const update = () => {
    updateCell++;
  }

  gridMouseDownStore.subscribe(value => mouseDown = value)

  const handleSelectCellRole = (e: MouseEvent) => {
    if (grid[i][j].role === Role.Start || grid[i][j].role === Role.Destination) {
      selectedCellRoleStore.set(grid[i][j].role);
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!mouseDown) return
    
    switch (get(selectedCellRoleStore)) {
      case (Role.Block): {
        if (grid[i][j].role !== Role.Normal) return
        grid[i][j].setRole(Role.Block);
        break
      }
      case (Role.Normal): {
        if (grid[i][j].role !== Role.Block) return
        grid[i][j].setRole(Role.Normal);
        break;
      }
      case (Role.Start): {
        if (grid[i][j].role !== Role.Normal) return
        grid[i][j].setRole(Role.Start);
        startCellStore.set([i, j])
        break;
      }
      case (Role.Destination): {
        if (grid[i][j].role !== Role.Normal) return
        grid[i][j].setRole(Role.Destination);
        desCellStore.set([i, j])
        break;
      }
    }
    updateCell++;
  }

</script>