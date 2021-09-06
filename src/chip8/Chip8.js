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
    actualFps = 0;
    elapsedFps = 0;
    nowFps = 0;
    thenFps = 0;
    fpsCounter = null;
    fpsCounterInterval = 2;

    animationReqId = null;

    constructor(canvas, fpsCounter = null) {
        const keyboard = new Keyboard();
        const monitor = new Monitor(canvas);
        this.cpu = new CPU(monitor, keyboard);
        this.fpsCounter = fpsCounter;

        this.fpsInterval = 1000 / this.fps;
    }

    async start (room) {
        if (this.animationReqId) {
            console.log(`Request ID ${this.animationReqId}. Canceling...`)
            cancelAnimationFrame(this.animationReqId)

        } else 
            console.warn("No request ID to cancel")

        this.then = this.thenFps = performance.now();
        this.startTime = this.then;
        
        this.fpsCounter.innerHTML = "Loading..."
        this.cpu.restart();
        await this.cpu.loadRom(room);

        this.step();
    }

    step() {
        this.animationReqId = requestAnimationFrame( () => this.step() );

        this.now = performance.now();
        this.elapsed = this.now - this.then;

        this.updateFps();

        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.cpu.cycle();
        }
    }

    updateFps () {
        this.nowFps = performance.now();
        this.elapsedFps = this.nowFps - this.thenFps;
        
        if (this.fpsCounter && this.elapsedFps > this.fpsCounterInterval * 1000) {
            this.thenFps = this.nowFps;

            this.actualFps = 1 / (this.elapsed / 1000);
            this.fpsCounter.innerHTML = Math.floor(this.actualFps);
        }
    }
}

export default Chip8;