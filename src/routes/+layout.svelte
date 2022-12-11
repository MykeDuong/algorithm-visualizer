<slot />
<style lang="scss" >
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;700&family=Sono:wght@600&display=swap');

  :root {
    --dark-color-0: #000000;
    --dark-color-1: #171717;
    --dark-color-2: #2B2B2B;
    --dark-color-3: #495464;

    --light-color-0: #FFFFFF;
    --light-color-1: #F4F4F2;
    --light-color-2: #E8E8E8;
    --light-color-3: #BBBFCA;
    --light-color-4: #7F8487;
    --light-color-5: #413F42;
    
    --highlight-color-0: #DC3535;

    --yellow-color:  #FFFF00;

    --green-color: #54B435;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Raleway', sans-serif;
  }
</style>

<script>
  export const prerender = true;
</script>