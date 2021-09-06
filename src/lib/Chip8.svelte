<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import Chip8 from '../chip8/Chip8';
  import { romStore } from "./store";

  let canvas = null;
  let chip8 = null;
  let fpsCounter = null;

  onMount(() => {
    chip8 = new Chip8(canvas, fpsCounter);
    chip8.start( get(romStore) );

    romStore.subscribe(() => {
      chip8.start( get(romStore) );
    })
  });
</script>

<div class="container">
  <div class="fps">
    FPS: <span bind:this={fpsCounter}>Warming up...</span>
  </div>
  <canvas bind:this={canvas}></canvas>  
</div>

<style>
  canvas {
    width: 100%; height: 100%;
  }

  .fps {
    bottom: 100%; left: 0%;
    position: absolute;
  }

  .container {
    position: relative;
  }
</style>
