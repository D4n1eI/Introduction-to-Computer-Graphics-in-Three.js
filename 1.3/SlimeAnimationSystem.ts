import * as THREE from "three";
import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { AttackingComponent } from "./AttackingComponent.js";
import { InputSystem } from "./InputSystem.js";
import { Slime } from "./Slime.js";
import { GravityComponent } from "./GravityComponent.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { MovementComponent } from "./MovementComponent.js";
import { HealthComponent } from "./HealthComponent.js";

export class SlimeAnimationSystem implements IUpdatableSystem{
    slime : Slime;
    constructor(slime:Slime){
        this.slime = slime;
    }

    update(delta: number): void {
        const movement = this.slime.getComponent<MovementComponent>("movement");
        const sprite = this.slime.getComponent<SpriteComponent>("sprite");
        const attack = this.slime.getComponent<AttackingComponent>("attack");
        const health = this.slime.getComponent<HealthComponent>("health");

        const horizontalSpeed = new THREE.Vector2(
            movement.velocity.x,
            movement.velocity.z
        ).length();

        if (Math.abs(movement.velocity.x) > 0.01) {
            sprite.setFlipX(movement.velocity.x < 0); 
        }

        if (health && health.isDead) {
            sprite.playAnimation("death");
            return;
        }

        if (health && health.hurtTimer > 0) {
            sprite.playAnimation("hurt");
            return;
        }

        if (attack.isAttacking) {
    // Stop horizontal movement
            movement.velocity.x = 0;
            movement.velocity.z = 0;

            // Play attack animation and keep facing the same direction
            sprite.setFlipX(movement.velocity.x < 0);
            sprite.playAnimation("attack");

            // Skip all other movement/animations
            return;
        
        } else if (horizontalSpeed > 0.1) {
            sprite.playAnimation("walk");

        } else {
            sprite.playAnimation("idle");

        }
    }   
}