import * as THREE from "three";
import { type CollisionComponent } from "./CollisionComponent.js";
import { type IComponent } from "./IComponent.js";

export class GameObject {
    object3D: THREE.Object3D;
    collisionComponent?: CollisionComponent;
    tag: string; // 👈 add this

    constructor(
      object3D: THREE.Object3D,
      collisionComponent?: CollisionComponent,
      tag: string = "default"
    ) {
      this.object3D = object3D;
      this.collisionComponent = collisionComponent;
      this.tag = tag;
    }

  getPosition(): THREE.Vector3 {
    return this.object3D.position;
  }

  setPosition(x: number, y: number, z: number): void {
    this.object3D.position.set(x, y, z);
  }

  getComponent<T extends IComponent>(name: string): T | undefined {
    if (name === "collision") {
      return this.collisionComponent as unknown as T;
    }
    return undefined;
  }

  update(delta: number): void {
    this.collisionComponent?.update(delta);
  }
}