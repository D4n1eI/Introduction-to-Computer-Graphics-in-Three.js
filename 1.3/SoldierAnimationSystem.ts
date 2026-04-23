import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { Entity } from "./Entity.js";
import { Soldier } from "./Soldier.js";
import { MovementComponent } from "./MovementComponent.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { GravityComponent } from "./GravityComponent.js";
import * as THREE from "three";
import { AttackingComponent } from "./AttackingComponent.js";
import { HealthComponent } from "./HealthComponent.js";

export class SoldierAnimationSystem implements IUpdatableSystem {
    soldier : Soldier
        private facingLeft: boolean = false; 

    constructor(soldier:Soldier) {
        this.soldier = soldier;
    }

    update(delta: number): void {
        const movement = this.soldier.getComponent<MovementComponent>("movement");
        const sprite = this.soldier.getComponent<SpriteComponent>("sprite");
        const gravity = this.soldier.getComponent<GravityComponent>("gravity");
        const attack = this.soldier.getComponent<AttackingComponent>("attack");
        const health = this.soldier.getComponent<HealthComponent>("health");
        const velocityX = movement.velocity.x;
        const horizontalSpeed = new THREE.Vector2(
            movement.velocity.x,
            movement.velocity.z
        ).length();


        const pos = this.soldier.object3D.position;

        console.log("POS:", pos.x.toFixed(3), pos.y.toFixed(3), pos.z.toFixed(3));
        console.log("VEL:", movement.velocity.x.toFixed(3), movement.velocity.y.toFixed(3), movement.velocity.z.toFixed(3));
        sprite.setFlipX(this.facingLeft);

        if (health && health.isDead) {
            sprite.playAnimation("death");
            return;
        }

        if (health && health.hurtTimer > 0) {
            sprite.playAnimation("hurt");
            return;
        }

        if (attack.isAttacking) {
            sprite.playAnimation("attack");
            return;
        }
        if (!attack.isAttacking && Math.abs(velocityX) > 0.01) {
            this.facingLeft = velocityX < 0;
        }
        if (Math.abs(velocityX) > 0.01) {
            sprite.setFlipX(velocityX < 0);
        }
        if (!gravity.collision?.isOnGround) {
            sprite.playAnimation("jump");
        } 
        else if (horizontalSpeed > 2.0) {
            sprite.playAnimation("run");
        } 
        else if (horizontalSpeed > 0.1) {
            sprite.playAnimation("walk");
        } 
        else {
            sprite.playAnimation("idle");
        }

        
    }
}

