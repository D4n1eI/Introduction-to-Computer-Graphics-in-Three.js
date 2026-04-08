import { IEventDrivenSystem } from "./IEventDrivenSystem";

export class InputSystem implements IEventDrivenSystem{
    private keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    isKeyDown(key: string): boolean {
        return !!this.keys[key];
    }
}