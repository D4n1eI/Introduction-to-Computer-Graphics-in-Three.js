import * as THREE from "three";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { MovementComponent } from "./MovementComponent";


enum SlimeState {
    Walking,
    Breathing
}

export class SlimeMovementSystem implements IUpdatableSystem {

    movement: MovementComponent;

    private state: SlimeState = SlimeState.Walking;

    private currentDirection: THREE.Vector3;
    private timer: number = 0;

    private walkDuration: number = 1.5;     
    private breatheDuration: number = 2;  
    private speed: number = 0.4;

    constructor(movement: MovementComponent) {
        this.movement = movement;

        this.currentDirection = this.generateDirection();
    }

    update(delta: number): void {

        this.timer += delta;

        switch (this.state) {

            case SlimeState.Walking:

                this.movement.setVelocity(
                    this.currentDirection.x * this.speed,
                    0,
                    this.currentDirection.z * this.speed
                );

                if (this.timer >= this.walkDuration) {
                    this.timer = 0;
                    this.state = SlimeState.Breathing;
                }

                break;


            case SlimeState.Breathing:

                this.movement.setVelocity(0, 0, 0);

                if (this.timer >= this.breatheDuration) {
                    this.timer = 0;
                    this.currentDirection = this.generateDirection();
                    this.state = SlimeState.Walking;
                }

                break;
        }
    }

    private generateDirection(): THREE.Vector3 {
        const dir = new THREE.Vector3().randomDirection();
        dir.y = 0;
        dir.normalize();
        return dir;
    }
}