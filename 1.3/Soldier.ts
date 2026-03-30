import * as THREE from "three";
import { Entity } from "./Entity.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { CollisionComponent } from "./CollisionComponent.js";
import { MovementComponent } from "./MovementComponent.js";
import { AttackRangeComponent } from "./AttackRangeComponent.js";

export class Soldier extends Entity {
  constructor(object3D : THREE.Object3D) {
    super(object3D);
  }  
}
