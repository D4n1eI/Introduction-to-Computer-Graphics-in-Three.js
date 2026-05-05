import * as THREE from "three";
import { IUpdatableComponent } from "./IUpdatableComponent";

export class MovementComponent implements IUpdatableComponent{
  object3D: THREE.Object3D;
  velocity: THREE.Vector3 = new THREE.Vector3();
  speed: number;
  maxSpeed: number; 
  walkCooldown = false;

  constructor(object3D: THREE.Object3D, speed: number = 1, maxSpeed: number = 10) {
    this.object3D = object3D;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
  }

  update(delta: number) {
    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.setLength(this.maxSpeed);
    }
    const movement = this.velocity.clone().multiplyScalar(this.speed * delta);
    this.object3D.position.add(movement);
  }

  setVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z);
  }

  addVelocity(deltaVel: THREE.Vector3) {
    this.velocity.add(deltaVel);
  }

  move(direction: THREE.Vector3) {
    const horizontal = new THREE.Vector3(direction.x, 0, direction.z);


    if (horizontal.length() > 0) {
      horizontal.normalize();
      this.velocity.x = horizontal.x;
      this.velocity.z = horizontal.z;
    } else {
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

  }
}