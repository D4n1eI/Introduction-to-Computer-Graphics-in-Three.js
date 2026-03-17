import { Entity } from "./Entity";
import * as THREE from "three";

export class AttackRangeComponent {
  owner: Entity;
  size: number;
  box: THREE.Box3;

  constructor(owner: Entity, size: number) {
    this.owner = owner;       
    this.size = size;
    this.box = new THREE.Box3();
  }

  update(): void {
    const object3D = this.owner.object3D;
    if (!object3D) {
      throw new Error("AttackRangeComponent: owner.object3D is null or undefined");
    }

    const width = this.size;
    const height = this.size;
    const depth = this.size;

    this.box.setFromCenterAndSize(
      object3D.position,
      new THREE.Vector3(width, height, depth)
    );
  }

  checkCollision(other: Entity): boolean {
    if (!other.collisionComponent) {
      throw new Error("AttackRangeComponent: other entity has no collision component");
    }
    return this.box.intersectsBox(other.collisionComponent.collisionBox);
  }
}