import * as THREE from "three";
export class SlimeAnimationSystem {
    slime;
    constructor(slime) {
        this.slime = slime;
    }
    update(delta) {
        const movement = this.slime.getComponent("movement");
        const sprite = this.slime.getComponent("sprite");
        const attack = this.slime.getComponent("attack");
        const horizontalSpeed = new THREE.Vector2(movement.velocity.x, movement.velocity.z).length();
        if (Math.abs(movement.velocity.x) > 0.01) {
            sprite.setFlipX(movement.velocity.x < 0);
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
        }
        else if (horizontalSpeed > 0.1) {
            sprite.playAnimation("walk");
        }
        else {
            sprite.playAnimation("idle");
        }
    }
}
