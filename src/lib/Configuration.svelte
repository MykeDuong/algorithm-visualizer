<div class="app__configuration">
  <div class="app__configuration-header">
    <Icon icon="material-symbols:chart-data-outline-rounded" width={40} color={theme.colors.highlightColor0} />
    <h1>Algorithm Visualizer</h1>
  </div>
  
  <div class="category">
    <button class="category-header" id='algorithms' on:click={handleCategoryExpand}>
      <Icon icon="ph:graph" width={40} color={theme.colors.highlightColor0} inline />
      Algorithms
    </button>
    {#if algorithmsVisible}
      <div class="app__configuration-options algorithm-options">
        <h2 class="subcategory-header">Weghted Algorithm</h2>
          {#each weightedAlgorithms as algorithm}
            <button class={`algorithm-button ${selectedAlgorithm === algorithm ? 'algorithm-selected' : ''}`} id={algorithm} on:click={handleSelectAlgorithm}>{algorithm}</button>
          {/each}
        <h2 class="subcategory-header">Unweighted Algorithm</h2>
          {#each unweightedAlgorithms as algorithm}
            <button class={`algorithm-button ${selectedAlgorithm === algorithm ? 'algorithm-selected' : ''}`} id={algorithm} on:click={handleSelectAlgorithm}>{algorithm}</button>
          {/each}
      </div>
    {/if}
  </div>

  <div class="category">
    <button class="category-header" id='cells' on:click={handleCategoryExpand}>
      <Icon icon="ic:twotone-square" color={theme.colors.highlightColor0} />
      Cells
    </button>
    {#if cellsVisible}
      <div class='cell-roles'>
        <button class={`cell-role-button ${selectedCellRole === 'Normal' ? 'cell-role-selected' : ''}`} id="Normal" value={Role.Normal} on:click={handleSelectCellRole}>
          <div class="cell-role-icon-wrapper">
            <Icon icon="ic:twotone-square" color={theme.colors.lightColor3} />
          </div>
          Normal
        </button>
        <button class={`cell-role-button ${selectedCellRole === 'Block' ? 'cell-role-selected' : ''}`} id="Block" value={Role.Block} on:click={handleSelectCellRole}>
          <div class="cell-role-icon-wrapper">
            <Icon icon="game-icons:brick-wall" width={32} color={theme.colors.lightColor1} />
          </div>
          Block
        </button>
        <button class={`cell-role-button ${selectedCellRole === 'Start' ? 'cell-role-selected' : ''}`} id="Start" value={Role.Start} on:click={handleSelectCellRole}>
          <div class="cell-role-icon-wrapper">
            <Icon icon="material-symbols:arrow-circle-right-rounded" color={theme.colors.lightColor1} />
          </div>
          Start
        </button>
        <button class={`cell-role-button ${selectedCellRole === 'Destination' ? 'cell-role-selected' : ''}`} id="Destination" value={Role.Destination} on:click={handleSelectCellRole}>
          <div class="cell-role-icon-wrapper">
            <Icon icon="tabler:target" color={theme.colors.highlightColor0} />
          </div>
          Destination
        </button>
      </div>
    {/if}
  </div>

  <div class="category">
    <button class="category-header" id='maze-creation' on:click={handleCategoryExpand}>
      <Icon icon="game-icons:maze" width={40} color={theme.colors.highlightColor0} />
      Maze Creation
    </button>
  </div>

    {#if locked === false}
    <button class="visualize-button" on:click={handleVisualize}>
      {selectedAlgorithm ? `Visualize ${selectedAlgorithm}` : 'No Algorithm Selected'}
    </button>
    {:else}
    <button class="locked-button"  disabled>
      Algorithm running...
    </button>
    {/if}

    <button class="reset-button" on:click={handleReset}>
      Reset Grid
    </button>

</div>

<style lang='scss'>
  h1 {
    color: var(--light-color-3);
    font-weight: 500;
    font-size: 1.8rem;
  }

  .app__configuration {
    background-color: var(--dark-color-1);
    width: 23%;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    overflow: scroll;

    .header-name {
      border-bottom: 1px solid var(--light-color-3);
      padding-bottom: 20px;
      margin-left: 10px;
      margin-right: 20px;
    }
  }

  .app__configuration-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--light-color-4);
    margin-top: 10px;
    margin-right: 20px;
    margin-left: 10px;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .app__configuration-options {
    display: flex;
    flex-direction: column;
  }

  .category {
      margin-bottom: 10px;
  }

  .category-header {
    border: none;
    background-color: inherit;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding-left: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    width: calc(100% - 20px);

    color: var(--light-color-3);
    font-weight: 500;
    font-size: 1.8rem;

    &:hover {
      background-color: var(--dark-color-2);
      border-radius: 10px;
    }

    * {
      pointer-events: none;
    }
  }

  .subcategory-header {
    color: var(--light-color-4);
    margin-left: 50px;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.2rem;
  }

  .algorithm-button {
    background-color: inherit;
    border: none;
    display: flex;
    margin-left: 40px;
    margin-right: 20px;
    padding-left: 10px;
    padding-top: 15px;
    padding-bottom: 15px;

    color: var(--light-color-3);
    font-weight: 500;
    font-size: 1.5rem;
  }

  .algorithm-selected {
    border-radius: 10px;
    background-color: var(--highlight-color-0);
  }

  .visualize-button {
    background-color: var(--highlight-color-0);
    border: none;
    border-radius: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-right: 20%;
    margin-left: calc(20% - 10px);
    margin-bottom: 20px;

    font-size: 1rem;
    text-align: center;
    color: var(--light-color-2);

    &:hover {
      box-shadow: 3px 3px 3px rgb(255, 255, 255, 0.2);
    }
  }

  .locked-button {
    background-color: var(--dark-color-2);
    border: none;
    border-radius: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-right: 20%;
    margin-left: calc(20% - 10px);
    margin-bottom: 20px;


    font-size: 1rem;
    text-align: center;
    color: var(--light-color-2);
  }

  .reset-button {
    background-color: var(--dark-color-2);
    border: none;
    border-radius: 10px;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-right: 20%;
    margin-left: calc(20% - 10px);
    margin-bottom: 30px;

    font-size: 1rem;
    text-align: center;
    color: var(--light-color-2);

    &:hover {
      box-shadow: 3px 3px 3px rgb(255, 255, 255, 0.2);
    }
  }

  .cell-roles {
    display: flex;
    flex-direction: column;
  }

  .cell-role-button {
    background-color: inherit;
    border: none;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 40px;
    margin-right: 20px;
    padding-left: 10px;
    padding-top: 15px;
    padding-bottom: 15px;

    color: var(--light-color-3);
    font-weight: 500;
    font-size: 1.5rem;
  }

  .cell-role-selected {
    border-radius: 10px;
    background-color: var(--highlight-color-0);
  }

  .cell-role-icon-wrapper {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    overflow: hidden;
  }
</style>

<script lang='ts'>
  import Icon from '@iconify/svelte';
  import theme from '$lib/theme';
  import { visualizeAlgorithmStore, lockStore, selectedCellRoleStore } from './stores';
	import { Role } from './Cell';

  let algorithmsVisible = true;
  let mazeCreationVisible = false;
  let cellsVisible = false;
  let locked = false

  let selectedAlgorithm: string = '';
  let selectedCellRole: Role = Role.Block;

  const weightedAlgorithms: string[] = ["Dijkstra's Algorithm", "Greedy Best-first Search", "A* Search"];
  const unweightedAlgorithms: string[] = ["Breath-first Search", "Depth-first Search"];

  const handleCategoryExpand = (e: MouseEvent) => {
    if ((<HTMLElement>e.target!).id === 'algorithms') {
      algorithmsVisible = !algorithmsVisible;
    } else if ((<HTMLElement>e.target!).id === 'maze-creation') {
      mazeCreationVisible = !mazeCreationVisible;
    } else if ((<HTMLElement>e.target!).id === 'cells') {
      cellsVisible = !cellsVisible;
    } else {
      return
    }
  }

  const handleSelectAlgorithm = (e: MouseEvent) => {
    selectedAlgorithm = (<HTMLElement>e.target!).id;
  }

  const handleSelectCellRole = (e: MouseEvent) => {
    selectedCellRole = <Role>(<HTMLButtonElement>e.target!).value;
    selectedCellRoleStore.set(selectedCellRole);
  }

  const handleVisualize = (e: MouseEvent) => {
    visualizeAlgorithmStore.set('clean');
    visualizeAlgorithmStore.set(selectedAlgorithm);
  }

  const handleReset = (e: MouseEvent) => {
    visualizeAlgorithmStore.set('reset');
  }

  $: lockStore.subscribe(value => {
    locked = value
  })
</script>