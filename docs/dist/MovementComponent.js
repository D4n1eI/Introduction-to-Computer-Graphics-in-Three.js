import * as THREE from "three";
export class MovementComponent {
    object3D;
    velocity = new THREE.Vector3();
    speed;
    maxSpeed;
    walkCooldown = false;
    constructor(object3D, speed = 1, maxSpeed = 10) {
        this.object3D = object3D;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
    }
    update(delta) {
        if (this.velocity.length() > this.maxSpeed) {
            this.velocity.setLength(this.maxSpeed);
        }
        const movement = this.velocity.clone().multiplyScalar(this.speed * delta);
        this.object3D.position.add(movement);
    }
    setVelocity(x, y, z) {
        this.velocity.set(x, y, z);
    }
    addVelocity(deltaVel) {
        this.velocity.add(deltaVel);
    }
    move(direction) {
        const horizontal = new THREE.Vector3(direction.x, 0, direction.z);
        if (horizontal.length() > 0) {
            horizontal.normalize();
            this.velocity.x = horizontal.x;
            this.velocity.z = horizontal.z;
        }
        else {
            this.velocity.x = 0;
            this.velocity.z = 0;
        }
    }
}
