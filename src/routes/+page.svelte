
<div class="app">
  <Configuration />
  <Grid />
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
</style> 

<script lang='ts'>
  import Configuration from '$lib/Configuration.svelte';
  import Grid from '$lib/Grid.svelte';
</script>
