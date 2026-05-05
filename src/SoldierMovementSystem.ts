import { InputSystem } from "./InputSystem.js";
import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { MovementComponent } from "./MovementComponent.js";
import { GravityComponent } from "./GravityComponent.js";
import { EventObserver } from "./EventObserver.js";
import * as THREE from "three";

export class SoldierMovementSystem implements IUpdatableSystem{

    movement : MovementComponent;
    gravity : GravityComponent;
    inputSystem : InputSystem;
    eventObserver : EventObserver;

    constructor(movement : MovementComponent, gravity: GravityComponent, inputSystem : InputSystem, eventObserver: EventObserver){
        this.movement = movement;
        this.gravity = gravity;
        this.inputSystem = inputSystem;
        this.eventObserver = eventObserver;
    }



    update(delta: number): void {

        let direction = new THREE.Vector3();

        if (this.inputSystem.isKeyDown("w")) direction.z -= 1;
        if (this.inputSystem.isKeyDown("s")) direction.z += 1;
        if (this.inputSystem.isKeyDown("a")) direction.x -= 1;
        if (this.inputSystem.isKeyDown("d")) direction.x += 1;

        if (this.inputSystem.isKeyDown(" ")) {
            if (this.gravity.jump()) {
                this.eventObserver.emit("jump");
            }
        }

        if (direction.length() > 0) {
            direction.normalize();
        }

        this.movement.setVelocity(direction.x, 0, direction.z);
    }
}