<script>
    import { onMount } from 'svelte';
    import keys from './keys'

    let keysCopy = [...keys];

    let doKeystroke = (key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', {'code': key}));

        setTimeout(() => {
            doKeyUp(key);
        }, 50);
    };

    let doKeyUp = (key) => {
        window.dispatchEvent(new KeyboardEvent('keyup', {'code': key}));
    };

    let hightlightOn = (keyCode) => {
        const index = keysCopy.findIndex(k => k.code === keyCode);
        if (index < 0) return;

        keysCopy[index].el.classList.add("button-active");
    }

    let hightlightOff = (keyCode) => {
        const index = keysCopy.findIndex(k => k.code === keyCode);
        if (index < 0) return;

        keysCopy[index].el.classList.remove("button-active");
    }

    onMount(() => {
        window.addEventListener('keydown', (e) => hightlightOn(e.code) , false);
        window.addEventListener('keyup', (e) => hightlightOff(e.code) , false);
    });
</script>

<div class="keyboard flex-center">
    <h2>Keyboard</h2>

    <div class="grid">
        {#each keysCopy as key}
            <button on:mousedown={() => doKeystroke(key.code)} bind:this={key.el}>{key.key}</button>
        {/each}
    </div>
</div>

<style lang="scss">
    .keyboard {
        margin-top: 50px;
        text-align: center;
        flex-direction: column;
    }

    .grid {
        width: 300px;
        height: 300px;
        display: grid;
        row-gap: 10px;
        column-gap: 10px;
        grid-template-rows: 1fr 1fr 1fr 1fr; 
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .grid > button {
        text-align: center;
        border: 1px solid white;
    }

    button {
        border: none;
        color: white;
        cursor: pointer;
        background-color: transparent;
        font-family: 'Press Start 2P', cursive;
    }

    @media (max-width: 400px) {
        .keyboard {
            margin-top: 10px;
        }
        .grid {
            width: 200px;
            height: 200px;
        }
    }
</style>