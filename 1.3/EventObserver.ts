export type GameEvent = "attack_hit" | "pickup" | "jump" | "death";

export class EventObserver {
    private listeners: Record<string, Function[]> = {};

    on(event: GameEvent, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: GameEvent, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}
