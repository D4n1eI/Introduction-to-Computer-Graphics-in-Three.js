import * as THREE from "three";
export class MovementComponent {
    object3D;
    velocity = new THREE.Vector3();
    speed;
    maxSpeed;
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
}
