import { IUpdatableSystem } from "./IUpdatableSystem";
import { Entity } from "./Entity";
import { Soldier } from "./Soldier";
import { MovementComponent } from "./MovementComponent";
import { SpriteComponent } from "./SpriteComponent";
import { GravityComponent } from "./GravityComponent";
import * as THREE from "three";
import { AttackingComponent } from "./AttackingComponent";

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
        const velocityX = movement.velocity.x;
        const horizontalSpeed = new THREE.Vector2(
            movement.velocity.x,
            movement.velocity.z
        ).length();

        sprite.setFlipX(this.facingLeft);

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

