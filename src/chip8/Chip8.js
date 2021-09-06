import CPU from './CPU';
import Monitor from './Monitor'
import Keyboard from './Keyboard'

class Chip8 {
    now = 0;
    then = 0;
    fps = 60;
    elapsed = 0;
    startTime = 0;
    fpsInterval = 0;
    cpu = null;

    constructor(canvas) {
        const keyboard = new Keyboard();
        const monitor = new Monitor(canvas);
        this.cpu = new CPU(monitor, keyboard);
    }

    start () {
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        this.startTime = this.then;

        this.step();
    }

    step() {
        requestAnimationFrame( () => this.step() );

        this.now = Date.now();
        this.elapsed = this.now - this.then;


        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.cpu.cycle();
        }
    }
}

export default Chip8;