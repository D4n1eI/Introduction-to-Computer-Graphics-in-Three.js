import * as THREE from "three";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { AttackingComponent } from "./AttackingComponent";
import { InputSystem } from "./InputSystem";
import { Slime } from "./Slime";
import { GravityComponent } from "./GravityComponent";
import { SpriteComponent } from "./SpriteComponent";
import { MovementComponent } from "./MovementComponent";
export class SlimeAnimationSystem implements IUpdatableSystem{
    slime : Slime;
    constructor(slime:Slime){
        this.slime = slime;
    }

    update(delta: number): void {
        const movement = this.slime.getComponent<MovementComponent>("movement");
        const sprite = this.slime.getComponent<SpriteComponent>("sprite");
        const attack = this.slime.getComponent<AttackingComponent>("attack");

        const horizontalSpeed = new THREE.Vector2(
            movement.velocity.x,
            movement.velocity.z
        ).length();

        if (Math.abs(movement.velocity.x) > 0.01) {
            sprite.setFlipX(movement.velocity.x < 0); 
        }

        if (attack.isAttacking) {
            sprite.setFlipX(movement.velocity.x < 0); 
            sprite.playAnimation("attack");
            return;
        } else if (horizontalSpeed > 0.1) {
            sprite.playAnimation("walk");
        } else {
            sprite.playAnimation("idle");
        }
    }   
}