import * as THREE from "three";
import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { MovementComponent } from "./MovementComponent.js";
import { Soldier } from "./Soldier.js";
import { HealthComponent } from "./HealthComponent.js";
import { Slime } from "./Slime.js";


enum SlimeState {
    Wander,
    Breathing,
    Seek,
}

export class SlimeMovementSystem implements IUpdatableSystem {

    movement: MovementComponent;
    slimeEntity?: Slime;

    private state: SlimeState = SlimeState.Wander;

    private currentDirection: THREE.Vector3;
    private timer: number = 0;

    private walkDuration: number = 1.5;     
    private breatheDuration: number = 2;  
    private speed: number = 0.4;
    private player : Soldier;

    constructor(movement: MovementComponent, player: Soldier, slimeEntity?: Slime) {
        this.movement = movement;
        this.player = player;
        this.slimeEntity = slimeEntity;
        this.currentDirection = this.generateDirection();
    }

    update(delta: number): void {
        if (this.slimeEntity) {
            const health = this.slimeEntity.getComponent<HealthComponent>("health");
            if (health && health.isDead) {
                this.movement.setVelocity(0, 0, 0);
                return;
            }
        }

        this.timer += delta;

        switch (this.state) {

            case SlimeState.Wander:

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
                    this.state = SlimeState.Wander;
                }

                break;
            
            case SlimeState.Seek:
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