<script>
  import { onMount } from "svelte";
  import Chip8 from '../chip8/Chip8';

  let canvas = null;
  let chip8 = null;

  onMount(() => {
    chip8 = new Chip8(canvas);
    chip8.start();
  });
</script>

<div class="">
  <canvas bind:this={canvas}></canvas>  
</div>

<style>
  canvas {
    width: 100%; height: 100%;
  }
</style>
