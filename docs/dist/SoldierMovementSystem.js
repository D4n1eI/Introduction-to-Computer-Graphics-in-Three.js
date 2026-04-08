import * as THREE from "three";
export class SoldierMovementSystem {
    movement;
    gravity;
    inputSystem;
    constructor(movement, gravity, inputSystem) {
        this.movement = movement;
        this.gravity = gravity;
        this.inputSystem = inputSystem;
    }
    update(delta) {
        let direction = new THREE.Vector3();
        if (this.inputSystem.isKeyDown("w"))
            direction.z -= 1;
        if (this.inputSystem.isKeyDown("s"))
            direction.z += 1;
        if (this.inputSystem.isKeyDown("a"))
            direction.x -= 1;
        if (this.inputSystem.isKeyDown("d"))
            direction.x += 1;
        if (this.inputSystem.isKeyDown(" ")) {
            this.gravity.jump();
        }
        if (direction.length() > 0) {
            direction.normalize();
        }
        this.movement.setVelocity(direction.x, 0, direction.z);
    }
}
