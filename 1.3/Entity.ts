import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { SpriteComponent } from "./SpriteComponent.js";

export abstract class Entity extends GameObject {
  components: Map<string, any> = new Map();

  constructor() {
    super(new THREE.Object3D());
  }

  addComponent<T>(name: string, component: T) {
    this.components.set(name, component);
  }

  getComponent<T>(name: string): T | undefined {
    return this.components.get(name);
  }

  update(delta: number) {
    for (const component of this.components.values()) {
      if (typeof component.update === "function") component.update(delta);
    }
  }
}