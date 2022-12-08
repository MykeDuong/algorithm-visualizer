<div class="app">
  <Configuration />
  <div class="app__grid">
    <p>hello there!</p>
  </div>
</div>

<style lang="scss">
  h1, h2, h3 {
    color: var(--light-color-3);
    font-weight: 500;
  }
  
  .app {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
  }
  
  .app__grid {
    width: 100%;
    background-color: var(--dark-color-2);
  }
</style>

<script lang='ts'>
  import Icon from '@iconify/svelte';
  import theme from '$lib/theme';

  import Configuration from '$lib/Configuration.svelte';

  const algorithms: string[] = ["Dijkstra' algorithm", "A* Search", "Greedy Best-first Search"];

</script>