import { InputSystem } from "./InputSystem";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { MovementComponent } from "./MovementComponent";
import { GravityComponent } from "./GravityComponent";
import * as THREE from "three";

export class SoldierMovementSystem implements IUpdatableSystem{

    movement : MovementComponent;
    gravity : GravityComponent;
    inputSystem : InputSystem;

    constructor(movement : MovementComponent, gravity: GravityComponent, inputSystem : InputSystem){
        this.movement = movement;
        this.gravity = gravity;
        this.inputSystem = inputSystem;
    }



    update(delta: number): void {

        let direction = new THREE.Vector3();

        if (this.inputSystem.isKeyDown("w")) direction.z -= 1;
        if (this.inputSystem.isKeyDown("s")) direction.z += 1;
        if (this.inputSystem.isKeyDown("a")) direction.x -= 1;
        if (this.inputSystem.isKeyDown("d")) direction.x += 1;

        if (this.inputSystem.isKeyDown(" ")) {
            this.gravity.jump();
        }

        if (direction.length() > 0) {
            direction.normalize();
        }

        this.movement.setVelocity(direction.x, 0, direction.z);
    }
}