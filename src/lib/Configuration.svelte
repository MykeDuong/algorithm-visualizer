<div class="app__configuration">
  <div class="app__configuration-header">
    <Icon icon="material-symbols:chart-data-outline-rounded" width={40} color={theme.colors.highlightColor0} />
    <h1>Algorithm Visualizer</h1>
  </div>
  
  <div class="category">
    <button class="category-header" id='algorithms'  on:click={handleCategoryExpand}>
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
    <button class="category-header" id='maze-creation' on:click={handleCategoryExpand}>
      <Icon icon="game-icons:maze" width={40} color={theme.colors.highlightColor0} />
      Maze Creation
    </button>
  </div>

  <div class="category">
    <button class="category-header" id='cells' on:click={handleCategoryExpand}>
      <Icon icon="ic:twotone-square" width={40} color={theme.colors.highlightColor0} />
      Cells
    </button>
  </div>

  <button class="visualize-button" on:click={handleVisualize}>
    {selectedAlgorithm ? `Visualize ${selectedAlgorithm}` : 'No Algorithm Selected'}
  </button>

</div>

<style lang='scss'>
  h1 {
    color: var(--light-color-3);
    font-weight: 500;
    font-size: 1.8rem;
  }

  .app__configuration {
    position: fixed;
    background-color: var(--dark-color-1);
    width: 23%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 10px;

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

    font-size: 1rem;
    text-align: center;
    color: var(--light-color-2);

    &:hover {
      box-shadow: 3px 3px 3px rgb(255, 255, 255, 0.2);
    }
  }

</style>

<script lang='ts'>
  import Icon from '@iconify/svelte';
  import theme from '$lib/theme';
  import { visualizeAlgorithm } from './stores';

  let algorithmsVisible = false;
  let mazeCreationVisible = false;
  let cellsVisible = false;

  let selectedAlgorithm: string = ''; 

  const weightedAlgorithms: string[] = ["Dijkstra's Algorithm", "A* Search"];
  const unweightedAlgorithms: string[] = ["Breath-first Search", "Depth-first Search"];

  const handleCategoryExpand = (e: MouseEvent) => {
    if ((<HTMLElement>e.target!).id === 'algorithms') {
      console.log("clicked");
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

  const handleVisualize = (e: MouseEvent) => {
    visualizeAlgorithm.set(selectedAlgorithm);
  }

</script>