
class Keyboard {
    
    keysPressed = [];
    cb = null;

    constructor () {
        this.KEYMAP = {
			"Digit1": 0x1, // 1
			"Digit2": 0x2, // 2
			"Digit3": 0x3, // 3
			"Digit4": 0xc, // 4
			"KeyQ": 0x4, // Q
			"KeyW": 0x5, // W
			"KeyE": 0x6, // E
			"KeyR": 0xD, // R
			"KeyA": 0x7, // A
			"KeyS": 0x8, // S
			"KeyD": 0x9, // D
			"KeyF": 0xE, // F
			"KeyZ": 0xA, // Z
			"KeyX": 0x0, // X
			"KeyC": 0xB, // C
			"KeyV": 0xF  // V
		}
        
        window.addEventListener('keydown', (e) => this.onKeyDown(e.code) , false);
		window.addEventListener('keyup', (e) => this.onKeyUp(e.code) , false);
    }

    onKeyDown(val) {
        let key = this.KEYMAP[val];
        this.keysPressed[key] = true;
    
        // Make sure onNextKeyPress is initialized and the pressed key is actually mapped to a Chip-8 key
        if (this.cb && this.cb !== null && this.keyPressed) {
            this.cb( this.keyPressed );
            this.cb = null;
        }
    }

    onKeyUp(val) {
        let key = this.KEYMAP[val];
        this.keysPressed[key] = false;
    }

    isKeyPressed(keyCode) {
        return this.keysPressed[keyCode];
    }

    setOnNextKeyPress (cb) {
        this.cb = cb
    }
};

export default Keyboard;