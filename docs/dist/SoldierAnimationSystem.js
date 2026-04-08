import * as THREE from "three";
export class SoldierAnimationSystem {
    soldier;
    facingLeft = false;
    constructor(soldier) {
        this.soldier = soldier;
    }
    update(delta) {
        const movement = this.soldier.getComponent("movement");
        const sprite = this.soldier.getComponent("sprite");
        const gravity = this.soldier.getComponent("gravity");
        const attack = this.soldier.getComponent("attack");
        const velocityX = movement.velocity.x;
        const horizontalSpeed = new THREE.Vector2(movement.velocity.x, movement.velocity.z).length();
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
