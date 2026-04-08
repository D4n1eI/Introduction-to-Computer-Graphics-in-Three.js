export class SlimeAttackingSystem {
    slimeAttack;
    player;
    attackRange;
    constructor(slimeAttack, attackRange, player) {
        this.slimeAttack = slimeAttack;
        this.attackRange = attackRange;
        this.player = player;
    }
    update(delta) {
        // 1️⃣ Tick cooldown
        if (this.slimeAttack.cooldownTimer > 0) {
            this.slimeAttack.cooldownTimer -= delta;
            if (this.slimeAttack.cooldownTimer < 0)
                this.slimeAttack.cooldownTimer = 0;
        }
        // 2️⃣ Tick attack timer
        if (this.slimeAttack.isAttacking) {
            this.slimeAttack.attackTimer -= delta;
            if (this.slimeAttack.attackTimer <= 0) {
                this.slimeAttack.isAttacking = false;
                this.slimeAttack.cooldownTimer = this.slimeAttack.cooldown; // Set cooldown **before checking new attack**
                console.log("Attack finished. Cooldown started:", this.slimeAttack.cooldownTimer);
            }
            return; // Prevent new attack in the same frame
        }
        // 3️⃣ Only start new attack if cooldown is done
        if (this.attackRange.checkCollision(this.player) && this.slimeAttack.cooldownTimer <= 0) {
            this.slimeAttack.isAttacking = true;
            this.slimeAttack.attackTimer = this.slimeAttack.attackDuration;
            console.log("New attack started!");
        }
    }
}
