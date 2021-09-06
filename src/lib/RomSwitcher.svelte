<script>
    import { get } from 'svelte/store';
    import roms from './roms'
    import { romStore } from './store';
</script>

<div class="container">
    <h2>ROM Selector</h2>

    <select bind:value={$romStore}>
        {#each roms as rom}
            <option value={rom.url}>{rom.name}</option>
        {/each}
    </select>    
</div>

<style>
    .container {
        text-align: center;
        margin-top: 80px;
    }
    
    select { 
        appearance: none;
        border: 1px solid white;
        outline: 0;
        font: inherit;

        color: white;
        margin-top: 20px;
        padding: 10px 4em 10px 1em;
        background: url(https://upload.wikimedia.org/wikipedia/commons/9/9d/Caret_down_font_awesome_whitevariation.svg)
        no-repeat right 0.8em center / 1.4em,
        linear-gradient(to left, var(--red-3) 3em, black 3em);
    }

    option {
        color: white;
        background: var(--background) !important;
    }
</style>