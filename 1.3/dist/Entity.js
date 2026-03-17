import * as THREE from "three";
import { GameObject } from "./GameObject.js";
export class Entity extends GameObject {
    components = new Map();
    constructor() {
        super(new THREE.Object3D());
    }
    addComponent(name, component) {
        this.components.set(name, component);
    }
    getComponent(name) {
        return this.components.get(name);
    }
    update(delta) {
        for (const component of this.components.values()) {
            if (typeof component.update === "function")
                component.update(delta);
        }
    }
}
