import * as THREE from "three";
import { Entity } from "./Entity.js";
import { CollisionComponent } from "./CollisionComponent.js";
import { IUpdatableBox } from "./IUpdatableBox.js";

export class AttackRangeComponent implements IUpdatableBox {
  owner: Entity;
  size: number;
  box: THREE.Box3;

  constructor(owner: Entity, size: number) {
    this.owner = owner;       
    this.size = size;
    this.box = new THREE.Box3();
  }

  update(delta: number): void {
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
    const otherCollision = other.getComponent<CollisionComponent>("collision");
    if (!otherCollision) {
        return false;
    }
    return this.box.intersectsBox(otherCollision.collisionBox);
  }
}