import { IUpdatableComponent } from "./IUpdatableComponent";
import * as THREE from "three";
import { CollisionComponent } from "./CollisionComponent";

export class GravityComponent implements IUpdatableComponent {
    object3D: THREE.Object3D;
    velocityY = 0;
    gravity = -9.8;
    collision?: CollisionComponent;
    jumpPower: number;

    constructor(object3D: THREE.Object3D, collision?: CollisionComponent, jumpPower: number = 3) {
        this.object3D = object3D;
        this.collision = collision;
        this.jumpPower = jumpPower;
    }

    update(delta: number) {
        if (!(this.collision?.isOnGround)) {
            this.velocityY += this.gravity * delta;
            this.object3D.position.y += this.velocityY * delta;
        } else if (this.velocityY < 0) {
            this.resetVelocity(); 
        }
    }

    resetVelocity() {
        this.velocityY = 0;
    }

    jump() {
        if (this.collision?.isOnGround) {
            this.velocityY = this.jumpPower;
            this.collision.isOnGround = false;
        }
    }
}