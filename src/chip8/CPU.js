const MEMORY_SIZE = 4096;
const NUM_REGISTERS = 16;

const START_ADDRESS = 0x200;
const FONTSET_START_ADDRESS = 0x50;

class CPU {
    registers = new Uint8Array(16);
    memory = new Uint8Array(4096);
    // stack = new Uint8Array(16);
    stack = new Array(16);
    index = 0;
    pc = 0;
    delayTimer = 0;
    soundTimer = 0;
    renderer = null;
    keyboard = null;
    speed = 10;

    constructor (renderer, keyboard) {
        this.renderer = renderer
        this.keyboard = keyboard
        this.pc = START_ADDRESS;

        this.loadRom();
        this.loadFonts();
    }

    async loadRom () {
        // const program = await fetch("/IBM Logo.ch8")
        const program = await fetch("/rooms/games/Airplane.ch8")
        .then(res => res.arrayBuffer())
        .then(buffer => {
            return new Uint8Array(buffer)
        });
        
        for (let i = 0; i < program.length; i++) {
            this.memory[START_ADDRESS + i] = program[i];
        }
    }

    loadFonts () {
        const fonts = this.getFontSet();
        for (let i = 0; i < fonts.length; i++) {
            this.memory[FONTSET_START_ADDRESS + i] = fonts[i];
        }
    }

    getFontSet() {
        return [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ]
    }

    cycle () {    
        for (let i = 0; i < this.speed; i++) {
            if (!this.paused) {
                let opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
                this.pc += 2;
                this.execute(opcode);
            }
        }


        if (!this.paused) {
            if (this.delayTimer > 0) {
                this.delayTimer -= 1;
            }
        
            if (this.soundTimer > 0) {
                this.soundTimer -= 1;
            }
        }

        this.renderer.paint();
    }

    execute (opcode) {
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        switch (opcode & 0xF000) {
            case 0x0000: {
                switch (opcode) {
                    case 0x00E0: {
                        this.renderer.clear()
                        break;
                    }
                    case 0x00EE: {
                        this.pc = this.stack.pop();
                        break;
                    }
                    default: {
                        console.error(`${opcode} not implemented`)
                    }
                }
                break;
            }
            case 0x1000: {
                this.pc = (opcode & 0x0FFF);
                break;
            }
            case 0x2000: {
                this.stack.push(this.pc);
                this.pc = (opcode & 0x0FFF);
                break;
            }
            case 0x3000: {
                if (this.registers[x] == (opcode & 0x00FF))
                    this.pc += 2;
                break;
            }
            case 0x4000: {
                if (this.registers[x] != (opcode & 0x00FF))
                    this.pc += 2;
                break;
            }
            case 0x5000: {
                if (this.registers[x] == this.registers[y])
                    this.pc += 2;
                break;
            }
            case 0x6000: {
                this.registers[x] = (opcode & 0x00FF);
                break;
            }
            case 0x7000: {
                this.registers[x] += (opcode & 0x00FF);
                break;
            }
            case 0x8000: {
                switch (opcode & 0x000F) {
                    case 0x0000: {
                        this.registers[x] = this.registers[y];
                        break;
                    }
                    case 0x0001: {
                        this.registers[x] = (this.registers[x] | this.registers[y]);
                        break;
                    }
                    case 0x0002: {
                        this.registers[x] = (this.registers[x] & this.registers[y]);
                        break;
                    }
                    case 0x0003: {
                        this.registers[x] = (this.registers[x] ^ this.registers[y]);
                        break;
                    }
                    case 0x0004: {
                        const added = this.registers[x] + this.registers[y];
                        this.registers[0xF] = (added > 0xFF) ? 0x1 : 0x0;
                        this.registers[x] = added & 0x00ff;
                        break;
                    }
                    case 0x0005: {
                        const subtraction = this.registers[x] - this.registers[y];
                        this.registers[0xF] = (subtraction > 0x0) ? 0x1 : 0x0;
                        this.registers[x] = subtraction & 0x00ff;
                        break;
                    }
                    case 0x0006: {
                        this.registers[0xF] = (this.registers[x] & 0x0001)? 0x1 : 0x0;
                        this.registers[x] >>= 2;
                        break;
                    }
                    case 0x0007: {
                        const subtraction = this.registers[y] - this.registers[x];
                        this.registers[0xF] = (subtraction > 0x0) ? 0x1 : 0x0;
                        this.registers[x] = subtraction & 0x00ff;
                        break;
                    }
                    case 0x000E: {
                        this.registers[0xF] = (this.registers[x] & 0b10000000)? 0x1 : 0x0;
                        this.registers[x] <<= 1;
                        break;
                    }
                    default: {
                        console.error(`${opcode} not implemented`)
                    }
                }
                break;
            }
            case 0x9000: {
                if (this.registers[x] != this.registers[y])
                    this.pc += 2;
                break;
            }
            case 0xA000: {
                this.index = (opcode & 0x0FFF);
                break;
            }
            case 0xB000: {
                this.pc = (opcode & 0x0FFF) + this.registers[0];
                break;
            }
            case 0xC000: {
                const kk = (opcode & 0x00FF);
                const rand = Math.floor(Math.random() * 255);
                this.registers[x] = (rand & kk);
                break;
            }
            case 0xD000: {
                let width = 8;
                let height = (opcode & 0xF);

                this.registers[0xF] = 0;

                for (let row = 0; row < height; row++) {
                    let sprite = this.memory[this.index + row];

                    for (let col = 0; col < width; col++) {
                        // If the bit (sprite) is not 0, render/erase the pixel
                        if ((sprite & 0x80) > 0) {
                            // If setPixel returns 1, which means a pixel was erased, set VF to 1
                            if (this.renderer.setPixel(this.registers[x] + col, this.registers[y] + row)) {
                                this.registers[0xF] = 1;
                            }
                        }

                        // Shift the sprite left 1. This will move the next next col/bit of the sprite into the first position.
                        // Ex. 10010000 << 1 will become 0010000
                        sprite <<= 1;
                    }
                }
                break;
            }
            case 0xE000: {
                switch (opcode & 0x00FF) {
                    case 0x009E: {
                        if (this.keyboard.isKeyPressed(this.registers[x])) {
                            this.pc += 2;
                        }
                        break;
                    }
                    case 0xA1: {
                        if (!this.keyboard.isKeyPressed(this.registers[x])) {
                            this.pc += 2;
                        }
                        break;
                    }
                    default: {
                        console.error(`${opcode} not implemented`)
                    }
                }
                break;
            }
            case 0xF000: {
                switch (opcode & 0x00FF) {
                    case 0x0007: {
                        this.registers[x] = this.delayTimer
                        break;
                    }
                    case 0x000A: {
                        this.paused = true;

                        const toDo = key => {
                            this.registers[x] = key;
                            this.paused = false;
                        }
                        this.keyboard.setOnNextKeyPress(toDo);
                        break;
                    }
                    case 0x0015: {
                        this.delayTimer = this.registers[x]
                        break;
                    }
                    case 0x0018: {
                        this.soundTimer = this.registers[x]
                        break;
                    }
                    case 0x001E: {
                        this.index += this.registers[x]
                        break;
                    }
                    case 0x0029: {
                        this.index = FONTSET_START_ADDRESS + (this.registers[x] * 5);
                        break;
                    }
                    case 0x0033: {
                        this.memory[this.index] = parseInt(this.registers[x] / 100);
                        this.memory[this.index + 1] = parseInt((this.registers[x] % 100) / 10);
                        this.memory[this.index + 2] = parseInt(this.registers[x] % 10);
                        break;
                    }
                    case 0x0055: {
                        for (let i = 0; i <= x; i++) {
                            this.memory[ this.index + i ] = this.registers[i];
                        }
                        break;
                    }
                    case 0x0065: {
                        for (let i = 0; i <= x; i++) {
                            this.registers[i] = this.memory[ this.index + i ];
                        }
                        break;
                    }
                    default: {
                        console.error(`${opcode} not implemented`)
                    }
                }
                break;
            }
            default: {
                console.error(`${opcode} not implemented`)
            }
        }
    }
}

export default CPU;