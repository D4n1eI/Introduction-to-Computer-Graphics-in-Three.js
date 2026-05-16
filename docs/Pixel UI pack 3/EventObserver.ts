import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { SoundManager } from "./SoundManager.js";

type Listener = (data?: any) => void;
export type GameEvent = "hurt" | "pickup" | "jump" | "death";

export class EventObserver {
    private listeners: Record<string, Listener[]> = {};

    constructor() {
        this.on("jump", () => SoundManager.getInstance().play("jump"));
        this.on("pickup", (data) => {
            if (data?.type === "healthpack") {
                SoundManager.getInstance().play("coin");
            }
        });
        this.on("hurt", () => SoundManager.getInstance().play("hurt"));
        this.on("death", () => SoundManager.getInstance().play("explosion"));
    }

    on(event: GameEvent | string, callback: Listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: GameEvent | string, data?: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    off(event: GameEvent | string, callback: Listener) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
}
