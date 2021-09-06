<script>
    import Chip8 from "./Chip8.svelte";
</script>

<div class="frame flex-center">
    <h1 class="title">CHIP-8</h1>
    <Chip8></Chip8>
</div>

<style lang="scss">
    .frame {
        max-width: 900px;
        position: relative;
        padding: 50px 50px;
        border: 5px solid white;
        width: 80%; height: 550px;
    }
    
    .title {
        padding: 0px 50px;
        position: absolute;
        bottom: 100%; left: 50%;
        transform: translate(-50%, 100%);
        background-color: var(--background);
    }

    @media (max-width: 800px) {
        .frame {
            height: 400px;
            padding: 0px 50px;
        }
    }

    @media (max-width: 500px) {
        .frame {
            height: 250px;
            padding: 0px 10px;
        }
        .title {
            font-size: 20px;
            padding: 0px 20px;
            white-space: nowrap;
        }
    }
</style>