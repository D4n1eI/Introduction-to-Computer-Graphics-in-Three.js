export class SoldierAttackingSystem {
    inputSystem;
    soldierAttack;
    constructor(inputSystem, soldierAttack) {
        this.inputSystem = inputSystem;
        this.soldierAttack = soldierAttack;
    }
    update(delta) {
        if (this.soldierAttack.cooldownTimer > 0)
            this.soldierAttack.cooldownTimer -= delta;
        if (this.soldierAttack.isAttacking) {
            this.soldierAttack.attackTimer -= delta;
            if (this.soldierAttack.attackTimer <= 0) {
                this.soldierAttack.isAttacking = false;
                this.soldierAttack.cooldownTimer = this.soldierAttack.cooldown;
            }
            return;
        }
        if (this.inputSystem.isKeyDown("f") && this.soldierAttack.cooldownTimer <= 0) {
            this.soldierAttack.isAttacking = true;
            this.soldierAttack.attackTimer = this.soldierAttack.attackDuration;
        }
    }
}
