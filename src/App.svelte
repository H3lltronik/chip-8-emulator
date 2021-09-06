<script>
  import Frame from "./lib/Frame.svelte";
  import Keyboard from "./lib/Keyboard.svelte";
  import RomSwitcher from "./lib/RomSwitcher.svelte";
</script>

<main class="container">
  <Frame></Frame>

  <div class="side-content">
    <Keyboard></Keyboard>
    <RomSwitcher></RomSwitcher>
  </div>

  <div class="footer">
    <div class="">
      <span>Made by <a href="https://www.linkedin.com/notifications/">H3lltronik</a></span>
      <span>|||</span>
      <a href="https://github.com/H3lltronik/chip-8-emulator">Source Code</a>
    </div>
  </div>
  
</main>

<style lang="scss" global>
  @import "./styles/main.scss";

  .container {
    max-width: 1920px;
  }

  .footer {
    margin-top: 30px;
    text-align: center;
    grid-row: 2/3;
    grid-column: 1/3;
    line-height: 2ex;
  }

  @media (max-width: 903px) {
    .footer {
      margin-top: 150px;
      grid-row: unset;
      grid-column: unset;
    } 
  }
</style>
