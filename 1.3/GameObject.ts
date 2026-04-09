import * as THREE from "three";
import { type CollisionComponent } from "./CollisionComponent.js";

export class GameObject {
  object3D: THREE.Object3D;
  collisionComponent?: CollisionComponent;

  constructor(object3D: THREE.Object3D, collisionComponent?: CollisionComponent) {
    this.object3D = object3D;
    this.collisionComponent = collisionComponent;
  }

  getPosition(): THREE.Vector3 {
    return this.object3D.position;
  }

  setPosition(x: number, y: number, z: number): void {
    this.object3D.position.set(x, y, z);
  }

  update(delta: number): void {
    this.collisionComponent?.update(delta);
  }
}