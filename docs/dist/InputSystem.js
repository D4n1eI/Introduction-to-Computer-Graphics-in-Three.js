export class InputSystem {
    keys = {};
    constructor() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    isKeyDown(key) {
        return !!this.keys[key];
    }
}
