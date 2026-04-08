import { GameObject } from "./GameObject.js";
export class Entity extends GameObject {
    components = new Map();
    constructor(object3D, initialComponents) {
        super(object3D);
        if (initialComponents) {
            for (const [name, component] of Object.entries(initialComponents)) {
                this.addComponent(name, component);
            }
        }
    }
    addComponent(name, component) {
        this.components.set(name, component);
    }
    getComponent(name) {
        return this.components.get(name);
    }
    isUpdatableComponent(component) {
        return typeof component.update === "function";
    }
    update(delta) {
        super.update(delta);
        for (const component of this.components.values()) {
            if (this.isUpdatableComponent(component)) {
                component.update(delta);
            }
        }
    }
}
