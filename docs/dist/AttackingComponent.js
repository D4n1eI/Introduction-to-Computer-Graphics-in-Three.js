export class AttackingComponent {
    isAttacking = false;
    wasAttacking = false;
    attackDuration;
    attackTimer = 0;
    cooldown;
    cooldownTimer = 0;
    constructor(attackDuration, cooldown) {
        this.attackDuration = attackDuration;
        this.cooldown = cooldown;
    }
}
